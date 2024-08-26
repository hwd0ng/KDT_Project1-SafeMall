import * as shopListData from '../data/shopListData.js'
import * as shopsComplaintsData from '../data/shopsComplaintsData.js'
import SocialMediaScraper from './snsCrawling.js';

const socialMediaScraper = new SocialMediaScraper();

// 메인페이지 호출
export async function getMain(req, res, next){
    const count = req.query.count
    console.log(count)
    const data = await shopsComplaintsData.getAll(count);
    if(!data) res.status(404);
    res.status(200).json({message:"메인 페이지", data})
}

// 서비스 소개
export function getInfo(req, res, next){
    res.status(200).json({message:"서비스 소개 페이지"});
}

// 쇼핑몰 검색
export async function search(req, res, next){
    const shopType = req.query.type
    const keyword = req.query.keyword
    console.log(shopType)
    console.log(keyword)
    if(shopType == 'shopName'){
        let result = []
        let list1 = await shopsComplaintsData.getByShopName(keyword)
        if(list1) {
            list1 = list1.map(item => ({
                ...item,
                businessState: '피해신고 다발업체'
            }));
        }
        let list2 = await shopListData.getByShopName(keyword)
        if(list2) {
            result = [...list1,...list2]
            res.status(200).json({result})}
        else res.status(404).json({message:"조회결과 없음",result})
    }
    else if( shopType == 'domainName'){
        let url = Buffer.from(keyword, 'base64').toString('utf-8');
        console.log(url)
        let result = []
        let list1 = await shopsComplaintsData.getByDomainName(url);
        if(list1){
            list1 = list1.map(item => ({
                ...item,
                businessState: '피해신고 다발업체'
            }));
        }
        let list2 = await shopListData.getByDomainName(url)
        console.log(list2)
        if(list2){
            console.log(`shops ${result}`)
            result = [...list1,...list2]
            console.log(result)
            res.status(200).json({result})
        }
        else res.status(404).json({message:"조회결과 없음",result})
    }
    else if( shopType == 'comNum'){
        // const result =  shopListData.getByComNum(shopType, keyword)
        res.status(200).json({message:`쇼핑몰데이터 아읻지(comNum): ${result}`})
    }
    else{
        res.status(404).json({message:"쇼핑몰데이터 없음"})
    }
}

// http://safemall.com/search/:id?type=0

// 상세페이지
export async function searchDetail(req,res,next){
    const id = req.params;
    const type = req.query.type;
    console.log(type, id)
    let data
        
    if(type == 1) // 피해다발 사이트 ObjectId
        data = await shopsComplaintsData.getDetail(id.id);
    else 
        data = await shopListData.getDetail(id.id);

    console.log('data: ', data)
    const emptyMassage = '확인 불가'
    if(data){
        if(type==0){
            const date = data.dateMonitoring ? data.dateMonitoring.toISOString().split('T')[0] : emptyMassage;
            const date2 = data.dateInit ? data.dateInit.toISOString().split('T')[0] : emptyMassage;
            const date3 = data.dateSiteOpen ? data.dateSiteOpen.toISOString().split('T')[0] : emptyMassage;
            const businessType = data.businessType ? data.businessType : emptyMassage;
            const mainItems = data.mainItems[0] != '' ? data.mainItems : emptyMassage;
            const possibleSW = data.possibleSW ? data.possibleSW : emptyMassage;
            const detailPayment = data.detailPayment[0] != '' ? data.detailPayment[0] : emptyMassage;
            const detailTermUse = data.detailTermUse ? data.detailTermUse : emptyMassage;
            const detailPIS = data.detailPIS ? data.detailPIS : emptyMassage;
            const detailWithdrawal = data.detailWithdrawal ? data.detailWithdrawal : emptyMassage;
            const PSS = data.PSS ? data.PSS : emptyMassage;
            
            const socialUrls = await socialMediaScraper.getSocialMediaUrls(data.domainName);
            // 각 플랫폼의 URL에 https://가 포함되어 있는지 체크하고, 없다면 추가
            console.log('socialUrls:', socialUrls)
            
            Object.entries(socialUrls).forEach(([platform, urls]) => {
                socialUrls[platform] = urls.map(url => {
                    // 빈 문자열 처리
                    if (!url) {
                    return null;
                    }
            
                    // URL 형식이 올바른지 확인 후 수정
                    if (!(url.startsWith('https://') || url.startsWith('http://'))) {
                    url = `https://${url}`;
                    }
            
                    // URL 유효성 검사 및 수정
                    if (url.endsWith('.com/') || url.endsWith('.com')) {
                    return null; // .com/으로 끝나면 null 반환
                    }
            
                    // 유효한 URL 반환
                    return url;
                })
                .filter(url => url !== null); // null인 URL 제거
                if (socialUrls[platform].length === 0) {
                    delete socialUrls[platform];
                }
            });
        
            console.log('filteredSocialUrls:', socialUrls)
            data = {
                ...data.toObject(), 
                dateMonitoring: date , 
                dateInit:date2, 
                dateSiteOpen: date3,
                businessType,
                mainItems,
                possibleSW,
                detailPayment,
                detailTermUse,
                detailPIS,
                detailWithdrawal,
                PSS,
                socialUrls
            }
        res.status(200).json({data});
        }else{
            const shopNameKor = data.shopNameKor ? data.shopNameKor : emptyMassage;
            const MainItems = data.MainItems ? data.MainItems : emptyMassage;
            const Totalreport = data.Totalreport ? data.Totalreport : emptyMassage;
            const Unprocess = data.Unprocess ? data.Unprocess : emptyMassage;
            const domainName = data.domainName ? data.domainName : emptyMassage;
            const mainDamageContent = data.mainDamageContent ? data.mainDamageContent : emptyMassage;
            const businessState = '피해신고 다발업체'
            data = {
                shopNameKor,
                MainItems,
                Totalreport,
                Unprocess,
                domainName,
                mainDamageContent,
                businessState
            }
            res.status(200).json({data});
        }
    }else{
        res.status(404).json({message:`입력 실패`});
    }
}


export async function getShopList(req,res,next){
    const data = await shopListData.ShopList();
    console.log('data:', data)
    if(data){
        res.status(200).json({data});
    }else{
        res.status(404).json({message:`입력 실패`});
    }
}