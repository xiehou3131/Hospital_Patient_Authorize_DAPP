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

    // hospital struct
    struct Hospital{
        address hospitalAddress;
        bool isValid;
        bool isVerified;
    }
    mapping(uint => Hospital)  hospitals; 
    mapping(address => uint)  hospitalAddress2Id;
    uint hospitalAmount = 0;

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
}
