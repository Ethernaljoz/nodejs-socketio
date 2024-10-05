

const getEnv = (key:string, defaultValue?:string):string =>{

    const value = process.env[key] || defaultValue
    if(value === undefined ){
        throw new Error(`missing the ${key} value in env file`)
    }
    return value
}

export const APP_ORIGIN = getEnv("APP_ORIGIN")
export const PORT = getEnv("PORT")