export async function initiatePurchaseFlow(itemIdsArray) {
    getDigitalGoodsService().then(async (service) => {
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
    
                // Send purchase token to your backend
                const response = await fetch('api/verify-google-payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        packageName: 'app.vercel.reedaa.twa',
                        purchaseToken: purchaseToken,
                        productId: itemId,
                        // Include any other necessary data
                    })
                });
    
                if (!response.ok) {
                    alert("verification failed");
                    alert(JSON.stringify(response));
                } else {
                    window.location.reload();
                }
            } catch (error) {
                console.error('Error during purchase flow:', error);
                window.location.reload();
            }
        }
    });
}

export async function getExistingPurchasesArray() {
    try {
        const service = await getDigitalGoodsService(); // Ensure we await the service
        if (service) {
            const existingPurchases = await service.listPurchases();
            return existingPurchases; // Correctly return the array
        }
        } catch (error) {
            console.error("Error fetching existing purchases:", error);
           // alert(`Kindly restart the app for smoother experience!`);
            return []; // Return an empty array in case of an error
        }
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
    const existingPurchasesArray = await getExistingPurchasesArray();
    
    // Debugging: Properly display the array in an alert
    // alert(`existingPurchasesArray: ${JSON.stringify(existingPurchasesArray)}`);
    
    // Ensure it's an array before checking length
    return Array.isArray(existingPurchasesArray) && existingPurchasesArray.length > 0;
};




