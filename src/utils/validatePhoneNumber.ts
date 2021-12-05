const validatePhoneNumber = (phoneNumber) => {
    // phone number validation
    const phoneNumberValidator = new RegExp("^09(0[1-2]|1[0-9]|3[0-9]|2[0-1])[0-9]{7}$");
    if (!phoneNumberValidator.test(phoneNumber)) {
        throw new Error('Phone number is invalid')
    }

    return phoneNumber
}

export default validatePhoneNumber