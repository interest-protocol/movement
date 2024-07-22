import mongoose, { Document, Schema } from 'mongoose';

import { Network } from '@/constants';

export interface ClammGraphModel extends Document {
  graph: string[][];
}

const modelName = 'MovementClammGraph';
const testnetModelName = modelName + 'Testnet';

const ClammGraphSchema = new Schema({
  graph: {
    type: [[String]],
    required: true,
  },
});

const devnetModel =
  mongoose.models[modelName] ||
  mongoose.model<ClammGraphModel>(modelName + 'Devnet', ClammGraphSchema);

const testnetModel =
  mongoose.models[testnetModelName] ||
  mongoose.model<ClammGraphModel>(testnetModelName, ClammGraphSchema);

export const getClammGraphModel = (network: Network): typeof devnetModel =>
  network === Network.DEVNET ? devnetModel : testnetModel;
