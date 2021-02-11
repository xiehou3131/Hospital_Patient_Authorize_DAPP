const MemberContract = artifacts.require('MemberContract')
const AuthorityContract = artifacts.require('AuthorityContract')

module.exports = async function(deployer, network, accouts) {
    await deployer.deploy(MemberContract)
    const memberContract = await MemberContract.deployed()

    await deployer.deploy(AuthorityContract)
    const authorityContract = await AuthorityContract.deployed()
}