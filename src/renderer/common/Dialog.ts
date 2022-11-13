export const createDialog = (
  url: string,
  config: Record<string, any>
): Promise<Window> => {
  return new Promise((resolve, reject) => {
    const windowProxy = window.open(url, '_blank', JSON.stringify(config));

    const readyHandler = (e: MessageEvent) => {
      const msg = e.data;

      if (msg['msgName'] === '__dialogReady') {
        window.removeEventListener('message', readyHandler);

        if (windowProxy) {
          resolve(windowProxy);
        }
      }
    };

    window.addEventListener('message', readyHandler);
  });
};

export const dialogReady = () => {
  const msg = {
    msgName: '__dialogReady',
  };

  window.opener.postMessage(msg);
};
