import { config } from "../config.js";
import * as shopListData from "../data/shopListData.js"
import * as openapiData from "../data/openapiData.js"
import * as shopsComplaintsData from "../data/shopsComplaintsData.js"

export async function updateDB_shopsList(req,res,next){
    console.log(`adminController 호출`)
    const apiKey = config.openapi.api_key;
    const api_result = await openapiData.getAPIData_shopsList(apiKey)
    if(!api_result) res.status(500).json({message:"openapiData 실패"});
    const DB_result = await shopListData.updateDB();
    if(!DB_result) res.status(500).json({message:"shopListData 실패"});
    res.status(201).json({message:"작업성공"})
}

export async function updateDB_ComplaintsList(req,res,next){
    console.log('adminController 호출')
    const apiKey = config.openapi.api_key;
    const api_result = await openapiData.getAPIData_ComplaintsList(apiKey);
    if(!api_result) res.status(500).json({message:"openapiData 실패"});
    const DB_result = await shopsComplaintsData.updateDB();
    if(!DB_result) res.status(500).json({message:"shopsComplaintsData 실패"});
    res.status(201).json({message:"작업성공"})
}
