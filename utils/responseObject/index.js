const responseObject = (message, status, data, error) => {
    if (error) return { status, message, error }
    if (data) return { status, message, data }
    return { status, message }
}

module.exports = { responseObject }