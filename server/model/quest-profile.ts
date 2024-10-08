import mongoose, { Document, Model, Schema } from 'mongoose';

const modelName = 'MovementQuestProfileImolaTestnet';

export interface QuestProfile {
  address: string;
  lastSwapAt: number;
  lastFaucetAt: number;
  lastAirdropAt: number;
  lastCreatePoolAt: number;
  lastCreateTokenAt: number;
  lastAddLiquidityAt: number;
  weeks: ReadonlyArray<number>;
}

export type QuestProfileDocument = Document & QuestProfile;

export const QuestProfileSchema = new Schema({
  address: {
    index: true,
    type: String,
    required: true,
    unique: true,
  },
  lastSwapAt: { type: Number },
  lastFaucetAt: { type: Number },
  lastAirdropAt: { type: Number },
  lastCreatePoolAt: { type: Number },
  lastCreateTokenAt: { type: Number },
  lastAddLiquidityAt: { type: Number },
  weeks: { type: Schema.Types.Array },
});

export default (mongoose.models[modelName] as Model<QuestProfileDocument>) ||
  mongoose.model<QuestProfileDocument>(modelName, QuestProfileSchema);
