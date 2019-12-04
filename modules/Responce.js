module.exports = class Responce{
    constructor(statusCode, status, props) {
        this.statusCode = statusCode;
        this.status = status,
        this.props = props;
    }
    toString() {
        let props = "";
        for (const param in this.props) {
            props += `"${param}":"${this.props[param]}",`;
        }
        props = props.substr(0, props.length - 1);
        return `{"statusCode":"${this.statusCode}","status":"${this.status}",${props}}`
    }
}