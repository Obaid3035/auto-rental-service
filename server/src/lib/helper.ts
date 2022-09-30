import moment from "moment";

export function formatAMPM(strDate: Date) {
    let date = moment(strDate).utc(false).toDate();
    let hours = date.getUTCHours()
    let minutes: string | number = date.getUTCMinutes()
    let ampm = hours >= 12 ? 'Pm' : 'Am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    const strTime = hours + ':' + minutes + ' ' + ampm;
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${strTime}`;
}

export function checkIfNull(item: any, property: string) {
    if (item[0] && item[0][property]) {
        return item[0].sum
    }
    return 0
}


export const formatIssueDateAndReturnDate = (rentals: any[], csv=false) => {
    return rentals.map((rental) => {
        const issueDate = new Date(rental.issueDate);
        const deadline = new Date(rental.deadline)
        rental.issueDate = formatAMPM(issueDate)
        rental.deadline = formatAMPM(deadline)
        let  obj = {
            _id: rental._id,
            issueDate: rental.issueDate,
            customer: rental.customer,
            regNo: rental.regNo,
            tariff: rental.tariff,
            advanceAmount: rental.advanceAmount,
            balance: rental.balance,
            deadline: rental.deadline,
        }
        if (csv) {
            delete obj._id
        }
        if (!rental.customer) {
            delete obj.customer
        }

        return Object.values(obj)
    })
}

