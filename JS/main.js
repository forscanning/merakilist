function fetchData(url) {
    return fetch(url)
        .then(res => res.json())
        .then(res=>res);
}

const main = async () =>{
    const devicesList = await fetchData('./JSON/devices.json');
    const networksList = await fetchData('./JSON/networks.json');
    const shopList = []
    
    networksList.forEach(item => {
        shopNr = item.name.split('_')
        const element = {
            serial: "",
            model: "",
            id: item.id,
            mac: "",
            dsl: "",
            gsm: "",
            shop:shopNr.length >= 2 ? Number(shopNr[1]):shopNr[0]
        }
        shopList.push(element)
    });
   
    devicesList.forEach( (item,index) =>{
        for(let i=0; i<devicesList.length ; i++){
            if(item.networkId === shopList[i].id){
                shopList[i].serial = item.serial;
                shopList[i].model = item.model;
                shopList[i].mac = item.mac;
                shopList[i].dsl = item.wan1Ip;
                shopList[i].gsm = item.wan2Ip;
            }
        }
    })
    const test = [['Id' , 'Sklep', 'Serial', 'Mac', 'Model', 'Dsl', 'Gsm']];
    shopList.forEach((item) => {
        test.push([item.id, item.shop, item.serial,item.mac, item.model,item.dsl, item.gsm])
    })
    
    const time = new Date();
    const timeName = `${time.getDate() < 10? "0"+time.getDate(): time.getDate()}_${time.getMonth()+1 < 10? "0"+time.getMonth(): time.getMonth()}_${time.getFullYear()}`

    let wb = XLSX.utils.book_new();

    wb.SheetNames.push(timeName);

    let ws_data = test.map(item => item);  //a row with 2 columns
    let ws = XLSX.utils.aoa_to_sheet(ws_data);

    wb.Sheets[timeName] = ws;

    let wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});

    function s2ab(s) { 
        let buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
        let view = new Uint8Array(buf);  //create uint8array as viewer
        for (let i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
        return buf;    
    }
    $("#button-a").click(function(){ 
        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), `Meraki_${timeName}.xlsx`);
    });
}
main()