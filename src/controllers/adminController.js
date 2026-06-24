const clientService = require('../services/clientService');

async function adminCreateClient(req,res){
    try {
        const client_config = req.body
        const result = await clientService.createClient(client_config)

        
        return res.status(200).json(result)
        
    } catch (error) {
        return res.status(400).json({error:error.message})
    }
}

async function adminGetClient(req,res){
    try {
        const {clientKey} = req.params
        const result = await clientService.getClient(clientKey)

        return res.status(200).json(result)
        
    } catch (error) {
        return res.status(400).json({error:error.message})
    }
}


module.exports = {adminCreateClient, adminGetClient}