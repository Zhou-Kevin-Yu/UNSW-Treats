
function standupStartV1 (token: string, channelId: number, length: number): number{

    return 0;
}

function standupActiveV1 (token: string, channelId: number){

    return {
        isActive: false,
        timeFinish: 0,
    };
};

function standupSendV1 (token: string, channelId: number, message: string) {

    return {};
}

export { standupStartV1, standupActiveV1, standupSendV1 };