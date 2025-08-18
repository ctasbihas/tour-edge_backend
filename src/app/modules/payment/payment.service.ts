const success = (query: Record<string, string>) => {
	console.log(query);
};
const fail = (query: Record<string, string>) => {
	console.log(query);
};
const cancel = (query: Record<string, string>) => {
	console.log(query);
};

export const PaymentServices = {
	success,
	fail,
	cancel,
};
