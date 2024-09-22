import { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';
import { pathOr } from 'ramda';

import dbConnect from '@/server';
import quest from '@/server/model/quest';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const time = Date.now();
    await NextCors(req, res, {
      methods: ['GET'],
      optionsSuccessStatus: 200,
      origin: process.env.ORIGIN ?? '*',
    });

    await dbConnect();

    const findQueryString = pathOr('{}', ['query', 'find'], req);

    const findQuery = JSON.parse(findQueryString);

    const data = await quest
      .find({
        timestamp: { $gte: 1722207600000 }, // get data from 29-07-2024
        ...findQuery,
      })
      .lean()
      .exec();

    console.log({
      query: findQueryString,
      time: Date.now() - time,
    });

    res.json(data);
  } catch (e) {
    console.log(e);

    res.status(500).send(e);
  }
};

export default handler;
