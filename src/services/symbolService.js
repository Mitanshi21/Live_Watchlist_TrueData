import axios from "axios"

export const symbolFetchApi = async () => {
    // await axios.get('https://api.truedata.in/getAllSymbols?user=td133&password=mitanshi@133')
    const res = await axios.get(`https://api.truedata.in/getAllSymbols?user=td133&password=mitanshi@133&segment=all`)
    return res.data.Records.map(item => item[1])
}