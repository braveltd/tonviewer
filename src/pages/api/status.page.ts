import { AccountsApi, BlockchainApi } from 'tonapi-sdk-js';
import { apiConfigV2 } from '../../helpers/api';

const ADDRESS = '0:faadd6978b504ce8b6951123b5385c58d36f7a19a0fb616ce5dd94f1e94f4f4e';

export default async function handler (req, res) {
  const apiConf = apiConfigV2();
  const accountConf = { accountId: ADDRESS };
  const blockchainService = new BlockchainApi(apiConf);
  const accountService = new AccountsApi(apiConf);

  if (req.method === 'GET') {
    try {
      const resArr = await Promise.allSettled([
        accountService.getAccount(accountConf),
        blockchainService.getRawAccount(accountConf),
        accountService.getJettonsBalances(accountConf),
        accountService.getNftItemsByOwner(accountConf)
      ]);

      resArr.forEach(({ value }: any) => {
        if (!value) {
          throw new Error('value not found');
        }
      });

      res.status(200).json({
        status: 'ok',
        name: 'tonviewer'
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: err.toString(),
        name: 'tonviewer'
      });
    }
  }
}
