export function formatWideAddress(address){
    if(!address){
        return "";
    }
    const { street, barangay, cityOrMunicipality, province } = address;
    var formattedAddress = "";
    
    if(street){formattedAddress += `${street}, `;}
    if(barangay){formattedAddress += `${barangay}, `;}
    if(cityOrMunicipality){formattedAddress += `${cityOrMunicipality}, `;}
    if(province){formattedAddress += `${province}`;}

    return formattedAddress;
}

export function formatShortAddress(address){
    if(!address){
        return "";
    }
    const { cityOrMunicipality, province } = address;
    var formattedAddress = "";

    if(cityOrMunicipality){formattedAddress += `${cityOrMunicipality}, `;}
    if(province){formattedAddress += `${province}`;}

    return formattedAddress;
}