function toDBTimestamp(date) {
    return (new Date(date).getTime()) / 1000;
}

function fromDBTimestamp(timestamp) {
    return new Date(timestamp * 1000);
}

module.exports = {
    toDBTimestamp,
    fromDBTimestamp
};