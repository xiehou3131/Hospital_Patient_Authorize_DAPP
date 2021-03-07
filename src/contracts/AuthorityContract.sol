pragma solidity >=0.5.0 <0.7.0;
import "./MemberContract.sol";
// SPDX-License-Identifier: SJTU-IST
contract AuthorityContract is MemberContract{
    // event Q_hasPatient(uint _hospitalId,uint _needAmount,uint _patientId,uint _timestamp,uint _duration);
    // event AskAuthorize(uint _hospitalId,uint _needAmount,uint _patientId,uint _timestamp);
    // event PatientAuthorize(uint _patientId,uint _needAmount,uint _hospitalId,uint _timestamp);
    // event ReturnURLs(uint _hospitalId,uint _needAmount,uint _timestamp);
    // //dataneeder struct
    // struct DataNeeder{
    //     uint hospitalId;
    //     uint patientId;
    //     uint datatype;
    //     uint duration;
    //     uint currentNum;
    //     uint timestamp;
    //     mapping(uint => DataProvider) providemap;
    // }
    // //dataprovider struct
    // struct DataProvider {
    //     uint hospitalId;
    //     string url;
    //     uint timestamp;
    // }
    // uint needAmount = 0;
    // mapping(uint =>DataNeeder) needmap;
    // //Hospital_A creates new dataneeder
    // function NewDataNeeder(uint _patientId,uint _datatype,uint _duration) public {
    //     // require(hospitals[hospitalAddress2Id[msg.sender]].isVerified);
    //     needAmount++;
    //     needmap[needAmount]=DataNeeder(hospitalAddress2Id[msg.sender],_patientId,_datatype,_duration,0,now);
    //     emit Q_hasPatient(hospitalAddress2Id[msg.sender],needAmount,_patientId,now,_duration);
    // }
    // //After checking database, Hospital_B asks patient's Authority
    // function AskPatientAuthority(uint _patientId,uint _needAmount) public {
    //     require(hospitals[hospitalAddress2Id[msg.sender]].isVerified);
    //     emit AskAuthorize(hospitalAddress2Id[msg.sender],_needAmount,_patientId,now);
    // }
    // //Patient Authorize to the need 
    // function PatientAuthorize2need(uint _hospitalId,uint _needAmount) public {
    //     require(patients[patientAddress2Id[msg.sender]].isVerified);
    //     emit PatientAuthorize(patientAddress2Id[msg.sender],_needAmount,_hospitalId,now);
    // }
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
