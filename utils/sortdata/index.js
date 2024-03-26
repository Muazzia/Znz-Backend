const sortData = (data) => {
    return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

module.exports = {
    sortData
}