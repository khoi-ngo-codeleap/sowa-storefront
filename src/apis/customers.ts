export interface Customer {
    id: string;
    name: string;
    email: string;
}

const users: Customer[] = [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com' },
    { id: '3', name: 'Alice Johnson', email: 'alice.johnson@example.com' },
    { id: '4', name: 'Bob Brown', email: 'bob.brown@example.com' },
    { id: '5', name: 'Charlie Davis', email: 'charlie.davis@example.com' },
    { id: '6', name: 'Diana Evans', email: 'diana.evans@example.com' },
    { id: '7', name: 'Ethan Harris', email: 'ethan.harris@example.com' },
    { id: '8', name: 'Fiona Clark', email: 'fiona.clark@example.com' },
    { id: '9', name: 'George Lewis', email: 'george.lewis@example.com' },
    { id: '10', name: 'Hannah Walker', email: 'hannah.walker@example.com' },
    { id: '11', name: 'Ian Young', email: 'ian.young@example.com' }
];

export const fetchCustomer = (id: string):Promise<Customer | undefined> => {
    return new Promise((resolve) => setTimeout(() => {
        resolve(users.find(user => user.id === id))
    }, 300))
}

export const fetchCustomers = async (): Promise<Customer[]> => {
    return new Promise((resolve) => setTimeout(() => {
        let [start, end] = [0,0];
        while (start === end) {
            [start, end] = Array(2).fill(0).map(() => Math.floor(users.length * Math.random())).sort();
        }

        const rs = users.slice(start,end);
        resolve(rs)
    }, 1000));
};
