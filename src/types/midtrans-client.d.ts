declare module 'midtrans-client' {
  export class Snap {
    constructor(options: {
      isProduction: boolean;
      serverKey: string | undefined;
      clientKey: string | undefined;
    });

    createTransaction(parameter: any): Promise<{
      token: string;
      redirect_url: string;
    }>;

    transaction: {
      notification(notificationJson: any): Promise<any>;
    };
  }

  export class CoreApi {
    constructor(options: {
      isProduction: boolean;
      serverKey: string | undefined;
      clientKey: string | undefined;
    });
  }
}
