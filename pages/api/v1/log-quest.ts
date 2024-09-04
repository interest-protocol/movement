import { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';
import { pathOr } from 'ramda';

import { Network } from '@/constants';
import { addQuest } from '@/server/lib/quest';
import { Quest } from '@/server/model/quest';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await NextCors(req, res, {
      methods: ['POST'],
      optionsSuccessStatus: 200,
      origin: process.env.ORIGIN ?? '*',
    });

    if (process.env.NODE_ENV === 'development') return;

    const network = pathOr(
      Network.TESTNET,
      ['query', 'network'],
      req
    ) as Network;

    if (network === Network.DEVNET) return;

    const body = req.body as Quest;

    const data = await addQuest(body, body.kind, network);

    res.json(data);
  } catch (e) {
    res.status(500).send(e);
  }
};

export default handler;
