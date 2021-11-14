export class EmailItem {
  description: string;
  username: string;
  subject: string;
  type: string;
}

export class ContactUsItem extends EmailItem {
  orgId?: string;
}

export class SupportItem extends ContactUsItem {
  orgId: string;
}
