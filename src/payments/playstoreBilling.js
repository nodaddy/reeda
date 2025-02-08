export async function initiatePurchaseFlow(itemIdsArray) {
    getDigitalGoodsService().then( async (service) => {
       if(service) { 
        try {
            const details = await service.getDetails(itemIdsArray);
            const itemId = details[0].itemId;
            const request = new PaymentRequest([{
                supportedMethods: 'https://play.google.com/billing',
                data: { sku: itemId }
            }]);
            const paymentResponse = await request.show();
            const { purchaseToken } = paymentResponse.details;
            await paymentResponse.complete();
            await service.acknowledge(purchaseToken, getPurchaseType(itemId));
        } catch (error) {
            console.error('Error during purchase flow:', error);
        }}
    });
}

export async function getExistingPurchasesArray() {
    getDigitalGoodsService().then(async (service) => {
        if(service){
            try {
            const existingPurchases = await service.listPurchases();
            alert('existingPurchages', existingPurchages);
            return existingPurchases; // returns an array
        } catch (error) {
            console.error("Error fetching existing purchases:", error);
            return []; // Return an empty array in case of an error
        }}
    });
}

async function getDigitalGoodsService() {
    if (typeof window === 'undefined') {
        return null; // Not in a browser environment
    }

    if (!('getDigitalGoodsService' in window)) {
        return null; // Digital Goods API not supported
    }

    try {
        const service = await window.getDigitalGoodsService('https://play.google.com/billing');
        return service || null; // Return service if available, otherwise null
    } catch (error) {
        console.error("Error accessing Digital Goods API:", error);
        return null;
    }

    // Example usage
    // getDigitalGoodsService().then((service) => {
    //     if (service) {
    //         console.log("Digital Goods API is available!", service);
    //     } else {
    //         console.log("Digital Goods API is not supported.");
    //     }
    // });
}

export const isUserPremium = async () => {
    const existingPurchagesArray = await getExistingPurchasesArray();
    alert('existingPurchagesArray', existingPurchagesArray);
    // in the case of reeda app if the array is not empty then that means that the user has bought 
    // either a subscription or a lifetime access
    return existingPurchagesArray?.length > 0;
}



