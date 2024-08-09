class Observer {
    update(message: string, error?: Error | null) {
        if(error) {
            console.error(message, error);
        } else {
            console.log(message);
        }
    }
}

export default Observer;