
const getDate = date => {
    var formattedDate = new Date(date);
    formattedDate = formattedDate.getDate() + " " + formattedDate.toLocaleDateString('default', { month: 'long' }) + " " + formattedDate.getFullYear()
    return formattedDate
}

export { getDate }