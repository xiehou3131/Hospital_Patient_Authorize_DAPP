import React, { Component } from 'react'
import Web3 from "web3"
import MemberContract from '../abis/MemberContract'
import AuthorityContract from '../abis/AuthorityContract'
import Navbar from './Navbar'
import { List, Typography, Divider, Button, Input } from 'antd';
import Main from './Main'
import dai from '../dai.png'
import './App.css'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()

    // Load MemberContract
    const memberContractData = MemberContract.networks[networkId]
    if(memberContractData) {
      const memberContract = new web3.eth.Contract(MemberContract.abi, memberContractData.address)
      this.setState({ memberContract })
      console.log(memberContract)
      // let tmp
      // let patientBlockNum = await memberContract.methods.GetPatientBlockNum().call({from:this.state.account})
      //     .then(function(result){
      //       tmp = result
      //     });
      // this.setState(({ patientBlockNum: tmp }))
      // console.log(tmp)
      // let hospitalBlockNum = await memberContract.methods.GetHospitalBlockNum().call({from:this.state.account})
      //     .then(function(result){
      //       tmp = result
      //     });
      // this.setState(({ HospitalBlockNum: tmp }))
      // console.log(tmp)

      let isManager
      await memberContract.methods.isManager().call({from:this.state.account})
          .then(function(result){
            isManager = result
          })
      console.log(isManager)

      if (isManager == 1) {
        await memberContract.events.PatientRegisterApply({
          fromBlock:"latest"
        }, function(error, event){
          console.log(event);
          let id = event.returnValues._patientId
          memberContract.methods.verifyPatient(id).send({from:accounts[0]})
        })

        await memberContract.events.HospitalRegisterApply({
          fromBlock:"latest"
        }, function(error, event){
          console.log(event);
          let id = event.returnValues._hospitalId
          memberContract.methods.verifyHospital(id).send({from:accounts[0]})
        })
      }

      // let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
      // this.setState({ daiTokenBalance: daiTokenBalance.toString() })
    } else {
      window.alert('MemberContract not deployed to detected network.')
    }

    // Load AuthorityContract
    const authorityContractData = AuthorityContract.networks[networkId]
    if(authorityContractData) {
      const authorityContract = new web3.eth.Contract(AuthorityContract.abi, authorityContractData.address)
      this.setState({ authorityContract })
      // let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
      // this.setState({ daiTokenBalance: daiTokenBalance.toString() })
    } else {
      window.alert('AuthorityContract not deployed to detected network.')
    }

    this.setState({ loading: false})

    this.getPatientId()
    this.getHospitalId()


  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async patientRegister() {
    await this.state.memberContract.methods.PatientRegister().send({from:this.state.account})
  }

  async getPatientId() {
    let test
    let Id = await this.state.memberContract.methods.getPatientIdByAddress().call({from:this.state.account})
        .then(function(result){
          test = result
        });
    this.setState({ patientId: test })
  }

  async getHospitalId() {
    let test
    let Id = await this.state.memberContract.methods.getHospitalIdByAddress().call({from:this.state.account})
        .then(function(result){
          test = result
        });
    this.setState({ hospitalId: test })
  }

  async getDataNeeders() {
    let eventsList
    let DataNeeders = await this.state.memberContract.getPastEvents('Q_hasPatient', {
      fromBlock: 0,
      toBlock: 'latest'
    }, function(error, events){
      eventsList = events
    })
    console.log(eventsList)
    this.setState({dataNeeders: eventsList})
  }

  async getAskAuthorize() {
    let AskList = []
    let patientId = this.state.patientId
    let DataNeeders = await this.state.memberContract.getPastEvents('AskAuthorize', {
      fromBlock: 0,
      toBlock: 'latest'
    }, function(error, events){
      let i
      for (i = 0;i < events.length;i++) {
        if (events[i].returnValues._patientId == patientId) {
          AskList.push(events[i])
        }
      }
    })
    console.log(AskList)
    this.setState({askList: AskList})
  }

  async getPatientPermission() {
    let PermissionList = []
    let hospitalId = this.state.hospitalId
    let Permissions = await this.state.memberContract.getPastEvents('PatientAuthorize', {
      fromBlock: 0,
      toBlock: 'latest'
    }, function(error, events){
      let i
      for (i = 0;i < events.length;i++) {
        if (events[i].returnValues._fromHospitalId == hospitalId) {
          PermissionList.push(events[i])
        }
      }
    })
    console.log(PermissionList)
    this.setState({permissionList: PermissionList})
  }

  async test() {
    let test
    let is = await this.state.memberContract.methods.HospitalId().call({from:this.state.account})
        .then(function(result){
          test = result
        });
    console.log(test)
  }

  NewDataNeeder(patientId) {
    // console.log(this.state.memberContract.hospitals(1))
    // this.state.memberContract.methods.PatientIsVerified(patientId).call({from:this.state.account})
    //     .then(function(result){
    //       console.log(result)
    //     })
    this.state.memberContract.methods.NewDataNeeder(patientId, 1, 1).send({from:this.state.account})
  }

  AskPatientAuthority(hospitalId, patientId, needId) {
    this.state.memberContract.methods.AskPatientAuthority(hospitalId, patientId, needId).send({from:this.state.account})
  }

  PatientAuthorize2need(toHospitalId, formHospitalId, needID) {
    this.state.memberContract.methods.PatientAuthorize2need(toHospitalId, formHospitalId, needID).send({from:this.state.account})
  }



  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      memberContract: {},
      authorityContract: {},
      patientId: 100,
      hospitalId: 100,
      dataNeeders: [],
      askList: [],
      permissionList: [],
      loading: true
    }
  }

  onChange = (e) => {console.log(e.target.value)};

  render() {

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>


                {/*PatientRegister*/}
                <form className="mb-3" onSubmit={(event) => {
                  event.preventDefault()
                  this.patientRegister()
                }}>
                  <button type="submit" className="btn btn-primary btn-block btn-lg">PatientRegister</button>
                </form>


                {/*GetPatientId*/}
                <form className="mb-3" onSubmit={(event) => {
                  event.preventDefault()
                  this.getPatientId()
                }}>
                  <div className="input-group mb-4">
                    {this.state.patientId}
                  </div>
                  <button type="submit" className="btn btn-primary btn-block btn-lg">GetPatientId</button>
                </form>


                {/*HospitalRegister*/}
                <form className="mb-3" onSubmit={(event) => {
                  event.preventDefault()
                  this.state.memberContract.methods.HospitalRegister().send({from:this.state.account})
                }}>
                  <button type="submit" className="btn btn-primary btn-block btn-lg">HospitalRegister</button>
                </form>


                {/*GetHospitalId*/}
                <form className="mb-3" onSubmit={(event) => {
                  event.preventDefault()
                  this.getHospitalId()
                }}>
                  <div className="input-group mb-4">
                    {this.state.hospitalId}
                  </div>
                  <button type="submit" className="btn btn-primary btn-block btn-lg">GetHospitalId</button>
                </form>


                {/*NewDataNeeder*/}
                <form className="mb-3" onSubmit={(event) => {
                  event.preventDefault()
                  let patientId
                  patientId = this.input.value.toString()
                  this.NewDataNeeder(patientId)
                }}>
                  <div className="input-group mb-4">
                    <input
                        type="text"
                        ref={(input) => { this.input = input }}
                        className="form-control form-control-lg"
                        placeholder="0"
                        required />
                    <div className="input-group-append">
                      <div className="input-group-text">
                         &nbsp;&nbsp;&nbsp; PatientId
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-block btn-lg">NewDataNeeder</button>
                </form>

                {/*getDataNeeders*/}
                <form className="mb-3" onSubmit={(event) => {
                  event.preventDefault()
                  this.getDataNeeders()
                }}>

                  <button type="submit" className="btn btn-primary btn-block btn-lg">GetDataNeeders</button>
                </form>

                <List
                    header={<div>dataNeeders列表</div>}
                    footer={<div>页脚</div>}
                    bordered
                    dataSource={this.state.dataNeeders}
                    renderItem={item => (
                        <List.Item>
                          <Typography.Text mark>HospitalId: </Typography.Text> {item.returnValues._hospitalId}
                          <Typography.Text mark>PatientId: </Typography.Text> {item.returnValues._patientId}
                          <Typography.Text mark>NeedAmount: </Typography.Text> {item.returnValues._needAmount}
                          {/*<Input placeholder={'info'} onChange={(e)=>this.onChange(e)}></Input>*/}
                          <Button onClick={()=>{this.AskPatientAuthority(item.returnValues._hospitalId, item.returnValues._patientId, item.returnValues._needAmount)}}>button</Button>
                        </List.Item>
                    )}
                />

                {/*getAskAuthorize*/}
                <form className="mb-3" onSubmit={(event) => {
                  event.preventDefault()
                  this.getAskAuthorize()
                }}>

                  <button type="submit" className="btn btn-primary btn-block btn-lg">GetAskAuthorize</button>
                </form>

                <List
                    header={<div>AuthorityAsk列表</div>}
                    footer={<div>页脚</div>}
                    bordered
                    dataSource={this.state.askList}
                    renderItem={item => (
                        <List.Item>
                          <Typography.Text mark>toHospitalId: </Typography.Text> {item.returnValues._toHospitalId}
                          <Typography.Text mark>fromHospitalId: </Typography.Text> {item.returnValues._fromHospitalId}
                          <Typography.Text mark>NeedAmount: </Typography.Text> {item.returnValues._needAmount}
                          {/*<Input placeholder={'info'} onChange={(e)=>this.onChange(e)}></Input>*/}
                          <Button onClick={()=>{this.PatientAuthorize2need(item.returnValues._toHospitalId, item.returnValues._fromHospitalId, item.returnValues._needAmount)}}>button</Button>
                        </List.Item>
                    )}
                />

                {/*getPatientPermission*/}
                <form className="mb-3" onSubmit={(event) => {
                  event.preventDefault()
                  this.getPatientPermission()
                }}>

                  <button type="submit" className="btn btn-primary btn-block btn-lg">GetPatientPermission</button>
                </form>

                <List
                    header={<div>PatientPermission列表</div>}
                    footer={<div>页脚</div>}
                    bordered
                    dataSource={this.state.permissionList}
                    renderItem={item => (
                        <List.Item>
                          <Typography.Text mark>toHospitalId: </Typography.Text> {item.returnValues._toHospitalId}
                          <Typography.Text mark>PatientId: </Typography.Text> {item.returnValues._patientId}
                          <Typography.Text mark>NeedAmount: </Typography.Text> {item.returnValues._needAmount}
                          {/*<Input placeholder={'info'} onChange={(e)=>this.onChange(e)}></Input>*/}
                          <Button onClick={()=>{this.PatientAuthorize2need(item.returnValues._toHospitalId, item.returnValues._fromHospitalId, item.returnValues._needAmount)}}>button</Button>
                        </List.Item>
                    )}
                />


                {/*test*/}
                <form className="mb-3" onSubmit={(event) => {
                  event.preventDefault()
                  this.test()
                }}>

                  <button type="submit" className="btn btn-primary btn-block btn-lg">test</button>
                </form>



              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
