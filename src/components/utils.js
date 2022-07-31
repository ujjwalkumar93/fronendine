const formatDate = (dateObj, formate) => {
    
    const d = new Date(dateObj); 

    if(formate === "yyyy-mm-dd") {
        return d.toLocaleString().split(',')[0].split("/").reverse().join("-")
    } else {
        return d.toLocaleString().split(',')[0]
    }
}

export default formatDate;

