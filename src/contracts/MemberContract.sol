pragma solidity >=0.5.0 <0.7.0;
// SPDX-License-Identifier: SJTU-IST
contract MemberContract {
    address private manager;
    event ManagerSet(address indexed oldManager, address indexed newManager);
    event PatientRegisterSuccess(uint _patientId,uint timestamp);
    event HospitalRegisterSuccess(uint _hospitalId,uint timestamp);
    event PatientRegisterApply(uint _patientId,uint timestamp);
    event HospitalRegisterApply(uint _hospitalId,uint timestamp);
    constructor() public  {
        manager = msg.sender;
        emit ManagerSet(address(0), manager);
    }
    modifier OnlyManager{
        require(msg.sender==manager,"Only manager can call this");
        _;
    }

    // patient struct
    struct Patient{
        address patientAddress;
        bool isValid;
        bool isVerified;
    }
    mapping(uint => Patient) patients;
    mapping(address =>uint) patientAddress2Id;
    uint patientAmount = 0;
    function PatientIsVerified(uint _patientId) public view returns(bool) {
        return patients[_patientId].isVerified;
    }

    // hospital struct
    struct Hospital{
        address hospitalAddress;
        bool isValid;
        bool isVerified;
    }
    mapping(uint => Hospital)  hospitals;
    mapping(address => uint)  hospitalAddress2Id;
    uint hospitalAmount = 0;
    function HospitalId() public view returns(uint) {
        return hospitalAddress2Id[msg.sender];
    }
    function HospitalIsVerified(uint _hospitalId) public view returns(bool) {
        return hospitals[_hospitalId].isVerified;
    }

    modifier OnlyUnRegister(){
        require(!patients[patientAddress2Id[msg.sender]].isValid);
        require(!hospitals[hospitalAddress2Id[msg.sender]].isValid);
        _;
    }

    function PatientRegister() public OnlyUnRegister{
        patientAmount++;
        patients[patientAmount] = Patient(msg.sender,true,false);
        patientAddress2Id[msg.sender]=patientAmount;
        emit PatientRegisterApply(patientAmount,now);
    }

    function HospitalRegister() public OnlyUnRegister{
        hospitalAmount++;
        hospitals[hospitalAmount] = Hospital(msg.sender,true,false);
        hospitalAddress2Id[msg.sender]=hospitalAmount;
        emit HospitalRegisterApply(hospitalAmount,now);
    }
    function getPatientIdByAddress() public view returns(uint){
        require(patients[patientAddress2Id[msg.sender]].isValid);
        return patientAddress2Id[msg.sender];
    }
    function getHospitalIdByAddress() public view returns(uint){
        require(hospitals[hospitalAddress2Id[msg.sender]].isValid);
        return hospitalAddress2Id[msg.sender];
    }
    function changeManager(address newManager) public OnlyManager {
        emit ManagerSet(manager, newManager);
        manager = newManager;
    }
    function getManager() private view returns (address) {
        return manager;
    }
    function isManager() public view returns (uint) {
        if (msg.sender == manager) {
            return 1;
        }
        else return 0;
    }
    function verifyPatient (uint _patientId) public OnlyManager{
        require(patients[_patientId].isValid);
        patients[_patientId].isVerified=true;
        emit PatientRegisterSuccess(_patientId,now);
    }
    function verifyHospital(uint _hospitalId) public OnlyManager{
        require(hospitals[_hospitalId].isValid);
        hospitals[_hospitalId].isVerified=true;
        emit HospitalRegisterSuccess(_hospitalId,now);
    }

    event Q_hasPatient(uint _hospitalId,uint _needAmount,uint _patientId,uint _timestamp,uint _duration);
    event AskAuthorize(uint _toHospitalId,uint _fromHospitalId,uint _needAmount,uint _patientId,uint _timestamp);
    event PatientAuthorize(uint _patientId,uint _needAmount,uint _toHospitalId,uint _fromHospitalId,uint _timestamp);
    event ReturnInfo(uint _toHospitalId,uint _fromHospitalId,uint _needAmount,uint _info, uint _timestamp);
    //dataneeder struct
    struct DataNeeder{
        uint hospitalId;
        uint patientId;
        uint datatype;
        uint duration;
        uint currentNum;
        uint timestamp;
        mapping(uint => DataProvider) providemap;
    }
    //dataprovider struct
    struct DataProvider {
        uint hospitalId;
        string url;
        uint timestamp;
    }
    uint needAmount = 0;
    mapping(uint =>DataNeeder) needmap;
    //Hospital_A creates new dataneeder
    function NewDataNeeder(uint _patientId,uint _datatype,uint _duration) public {
        require(hospitals[hospitalAddress2Id[msg.sender]].isVerified);
        needAmount++;
        needmap[needAmount]=DataNeeder(hospitalAddress2Id[msg.sender],_patientId,_datatype,_duration,0,now);
        emit Q_hasPatient(hospitalAddress2Id[msg.sender],needAmount,_patientId,now,_duration);
    }
    //After checking database, Hospital_B asks patient's Authority
    function AskPatientAuthority(uint _hospitalId, uint _patientId,uint _needAmount) public {
        require(hospitals[hospitalAddress2Id[msg.sender]].isVerified);
        emit AskAuthorize(_hospitalId,hospitalAddress2Id[msg.sender],_needAmount,_patientId,now);
    }
    //Patient Authorize to the need 
    function PatientAuthorize2need(uint _toHospitalId, uint _fromHospitalId, uint _needAmount) public {
        require(patients[patientAddress2Id[msg.sender]].isVerified);
        emit PatientAuthorize(patientAddress2Id[msg.sender],_needAmount,_toHospitalId,_fromHospitalId,now);
    }
    //Hospital_B provides URLs to the need
    function ProvideData(uint _toHospitalId, uint _needAmount,uint info) public {
        require(hospitals[hospitalAddress2Id[msg.sender]].isVerified);
        emit ReturnInfo(_toHospitalId,hospitalAddress2Id[msg.sender],_needAmount,info,now);
    }
    //Hospital_A gets URLs from the need
    function getURLByDataNeeder(uint _needAmount,uint urlId) public view returns(uint,string memory) {
        require(hospitals[hospitalAddress2Id[msg.sender]].isVerified);
        DataNeeder storage _dataNeeder = needmap[_needAmount];
        require(hospitals[_dataNeeder.hospitalId].hospitalAddress==msg.sender);
        uint _providedHospitalId=_dataNeeder.providemap[urlId].hospitalId;
        string memory _url=(_dataNeeder.providemap[urlId]).url;
        return(_providedHospitalId,_url); 
    }
    // //Hospital_B provides URLs to the need
    // function ProvideData(uint _needAmount,string memory _url) public {
    //     require(hospitals[hospitalAddress2Id[msg.sender]].isVerified);
    //     DataNeeder storage _dataNeeder = needmap[_needAmount];
    //     _dataNeeder.currentNum++;
    //     _dataNeeder.providemap[_dataNeeder.currentNum]=DataProvider(hospitalAddress2Id[msg.sender], _url,now);
    //     emit ReturnURLs(hospitalAddress2Id[msg.sender],_needAmount,now);
    // }
    // //Hospital_A gets URLs from the need
    // function getURLByDataNeeder(uint _needAmount,uint urlId) public view returns(uint,string memory) {
    //     require(hospitals[hospitalAddress2Id[msg.sender]].isVerified);
    //     DataNeeder storage _dataNeeder = needmap[_needAmount];
    //     require(hospitals[_dataNeeder.hospitalId].hospitalAddress==msg.sender);
    //     uint _providedHospitalId=_dataNeeder.providemap[urlId].hospitalId;
    //     string memory _url=(_dataNeeder.providemap[urlId]).url;
    //     return(_providedHospitalId,_url); 
    // }
}
