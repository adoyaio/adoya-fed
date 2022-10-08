export class EmailItem {
  description: string;
  username: string;
  subject: string;
  type: string;
}

export class ContactUsItem extends EmailItem {
  orgId?: string;
  userId?: string;
}

export class SupportItem extends ContactUsItem {
  orgId: string;
  userId: string;
}
