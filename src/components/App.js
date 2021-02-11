import React, { Component } from 'react'
import Web3 from "web3"
import MemberContract from '../abis/MemberContract'
import AuthorityContract from '../abis/AuthorityContract'
import Navbar from './Navbar'
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

  async getPatientId() {
    let test
    let Id = await this.state.memberContract.methods.getPatientIdByAddress().call({from:this.state.account})
        .then(function(result){
          test = result
          // this.setState({ patientId: test })
          console.log(test)
        });
    this.setState(({ patientId: test }))
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      memberContract: {},
      authorityContract: {},
      patientId: 100,
      loading: true
    }
  }

  render() {
    // let content
    // if (this.state.loading) {
    //   content = <p id="loader" className="text-center">Loading...</p>
    // } else {
    //   content = <Main
    //
    //   />
    // }

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

                <form className="mb-3" onSubmit={(event) => {
                  event.preventDefault()
                  this.state.memberContract.methods.PatientRegister().send({from:this.state.account})
                }}>
                  <button type="submit" className="btn btn-primary btn-block btn-lg">PatientRegister</button>
                </form>



                <form className="mb-3" onSubmit={(event) => {
                  event.preventDefault()
                  this.getPatientId()
                }}>
                  {/*<div>*/}
                  {/*  <label className="float-left"><b>Stake Tokens</b></label>*/}
                  {/*</div>*/}
                  <div className="input-group mb-4">
                    {this.state.patientId}
                  </div>
                  <button type="submit" className="btn btn-primary btn-block btn-lg">GetPatient</button>
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
