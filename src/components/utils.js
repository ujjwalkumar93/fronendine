const formatDate = (dateObj, formate) => {
    
    const d = new Date(dateObj); 
    //console.log("local string", d.toLocaleString().split(',')[0] ); 
    //return d.toLocaleString().split(',')[0]

    if(formate === "yyyy-mm-dd") {
        return d.toLocaleString().split(',')[0].split("/").reverse().join("-")
    } else {
        return d.toLocaleString().split(',')[0]
    }
}

export default formatDate;

