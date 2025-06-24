// Function to get country code from country name
export function getCountryCode(countryName) {
    // Common country name to ISO code mapping
    const countryMap = {
        'united states': 'US',
        'usa': 'US',
        'united kingdom': 'GB',
        'uk': 'GB',
        'canada': 'CA',
        'australia': 'AU',
        'germany': 'DE',
        'france': 'FR',
        'italy': 'IT',
        'spain': 'ES',
        'japan': 'JP',
        'china': 'CN',
        'india': 'IN',
        'brazil': 'BR',
        'russia': 'RU',
        'mexico': 'MX',
        'argentina': 'AR',
        'south africa': 'ZA',
        'egypt': 'EG',
        'nigeria': 'NG',
        'kenya': 'KE',
        'morocco': 'MA',
        'turkey': 'TR',
        'greece': 'GR',
        'netherlands': 'NL',
        'belgium': 'BE',
        'switzerland': 'CH',
        'austria': 'AT',
        'poland': 'PL',
        'sweden': 'SE',
        'norway': 'NO',
        'denmark': 'DK',
        'finland': 'FI',
        'ireland': 'IE',
        'portugal': 'PT',
        'czech republic': 'CZ',
        'hungary': 'HU',
        'romania': 'RO',
        'bulgaria': 'BG',
        'croatia': 'HR',
        'serbia': 'RS',
        'ukraine': 'UA',
        'thailand': 'TH',
        'vietnam': 'VN',
        'singapore': 'SG',
        'malaysia': 'MY',
        'indonesia': 'ID',
        'philippines': 'PH',
        'south korea': 'KR',
        'taiwan': 'TW',
        'hong kong': 'HK',
        'new zealand': 'NZ',
        'chile': 'CL',
        'peru': 'PE',
        'colombia': 'CO',
        'venezuela': 'VE',
        'ecuador': 'EC',
        'uruguay': 'UY',
        'paraguay': 'PY',
        'bolivia': 'BO',
        'saudi arabia': 'SA',
        'united arab emirates': 'AE',
        'qatar': 'QA',
        'kuwait': 'KW',
        'bahrain': 'BH',
        'oman': 'OM',
        'jordan': 'JO',
        'lebanon': 'LB',
        'israel': 'IL',
        'iran': 'IR',
        'iraq': 'IQ',
        'afghanistan': 'AF',
        'pakistan': 'PK',
        'bangladesh': 'BD',
        'sri lanka': 'LK',
        'nepal': 'NP',
        'bhutan': 'BT',
        'maldives': 'MV'
    };
        // Convert to lowercase for matching
    const lowerCountryName = countryName.toLowerCase().trim();
    
    // Try direct mapping first
    if (countryMap[lowerCountryName]) {
        return countryMap[lowerCountryName];
    }
    
    // Try partial matching for cases like "United States of America"
    for (const [key, code] of Object.entries(countryMap)) {
        if (lowerCountryName.includes(key) || key.includes(lowerCountryName)) {
            return code;
        }
    }
    
    // If no match found, try to extract first two letters as fallback
    return countryName.substring(0, 2).toUpperCase();
}