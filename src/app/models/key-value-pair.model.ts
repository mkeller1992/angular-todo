

export class KeyValuePair<T, U>
{
	key: T;
	val: U;
	constructor(key: T, value: U) {
		this.key = key;
		this.val = value;
	}
}