import { faker } from '@faker-js/faker';

export const STUDENTS = Array.from({ length: 50 }, (_, index) => ({
	id: index.toString(),
	name: `${faker.person.firstName()} ${faker.person.lastName()}`,
	info: faker.lorem.paragraph()
}));

export type Student = {
	id: number;
	name: string;
	info: string;
};
