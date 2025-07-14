export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  state: string;
  phone: string;
  email: string;
  locale: string;
  displayName: string;
  address: {
    id: string;
    formattedArea: string;
    country: string;
  }[];
  orderAggregate: {
    sum: number | null;
    count: number;
  }[];
}

export interface CustomerDetail {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  locale: string;
  phone: string;
  displayName: string;
  rfmGroup: string | null;
  taxExempt: boolean;
  createdAt: string;
  note: string | null;
  tags: {
    tagId: string;
    enabled: boolean;
  }[];
  marketingConsent: {
    type: string;
    status: string;
  }[];
  address: {
    id: string;
    country: string;
    formattedArea: string;
  }[];
  orderAggregate: {
    sum: number | null;
    count: number;
  }[];
}
