export interface Event {
  _id: string;
  owner: string;
  name: string;
  type: string;
  description: string;
  location: {
    venue: string;
    street: string;
    city: string;
    state: string;
    zipcode: string;
  };
  date_time: {
    start: string;
    end: string;
  };
  attendee_limits: {
    min: number;
    max: number;
  };
  ticket_info: {
    price: number;
    availability: boolean;
  };
  conditions: string[];
  responsible_info: {
    name: string;
    email: string;
    phone: string;
  };
  images: string[];
  is_featured: boolean;
  createdAt: string;
  updatedAt: string;
}
