import React, { useState } from 'react'


//export const textValidation  = (name: string, value: string, errors: any ,setErrors: ({}) => void) => {
//     if(value.length <= 4){
//         setErrors({
//             ...errors,
//             [name]:name + ' atleast have 5 letters'
//         })
//     }else{
//         let newObj = {...errors };
//         delete newObj[name]
//         setErrors(newObj);
//
//     }
// }

interface ICustomer {
    name: string,
    cnic: string,
    passport: string,
    residentialAddress: string,
    officeAddress: string,
    phone: string,
    license: string,
    referenceName: string,
    referencePhone: string,
    referenceAddress: string,
    referenceCnic: string,

}

const useForm = (callback: () => void) => {


    const [values, setValues] = useState<ICustomer>({
        name: '',
        cnic: '',
        passport: '',
        residentialAddress: '',
        officeAddress: '',
        phone: '',
        license: '',
        referenceName: '',
        referencePhone: '',
        referenceAddress: '',
        referenceCnic: '',
    });

    const [errors] = useState<any>({});

    //
    // const validate = (name: string, value: string) => {
    //     switch (name) {
    //         case 'name':
    //            textValidation(name, value, errors, setErrors);
    //             break;
    //         case 'cnic':
    //             textValidation(name, value, errors, setErrors);
    //             break;
    //         default:
    //             break;
    //     }
    // }

    const handleChange = (event:  React.ChangeEvent<HTMLInputElement>) => {

        event.persist();

        const { name, value } = event.target;

        // validate(name ,value);


        setValues({
            ...values,
            [name]:value,
        })
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        if(event) event.preventDefault();

        if(Object.keys(errors).length === 0 && Object.keys(values).length !==0 ){
            callback();

        }else{
            alert("There is an Error!");
        }
    }

    return {
        values,
        setValues,
        errors,
        handleChange,
        handleSubmit
    }
}

export default useForm
