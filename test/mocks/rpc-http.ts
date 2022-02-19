import bs58 from 'bs58';
import BN from 'bn.js';
import * as mockttp from 'mockttp';
import {Connection, PublicKey, HttpHeaders} from '@solana/web3.js';

const mockServer: mockttp.Mockttp | undefined =
  process.env.TEST_LIVE === undefined ? mockttp.getLocal() : undefined;

let uniqueCounter = 0;
const uniqueSignature = () => {
  return bs58.encode(new BN(++uniqueCounter).toArray(undefined, 64));
};

type RpcRequest = {
  method: string;
  params?: Array<any>;
};

type RpcResponse = {
  context: {
    slot: number;
  };
  value: any;
};

const mockRpcSocket: Array<[RpcRequest, RpcResponse]> = [];

const mockRpcMessage = ({
  method,
  params,
  result,
}: {
  method: string;
  params: Array<any>;
  result: any;
}) => {
  mockRpcSocket.push([
    {method, params},
    {
      context: {slot: 11},
      value: result,
    },
  ]);
};

const mockRpcResponse = async ({
  method,
  params,
  value,
  error,
  withContext,
  withHeaders,
}: {
  method: string;
  params: Array<any>;
  value?: any;
  error?: any;
  withContext?: boolean;
  withHeaders?: HttpHeaders;
}) => {
  if (!mockServer) return;

  let result = value;
  if (withContext) {
    result = {
      context: {
        slot: 11,
      },
      value,
    };
  }

  await mockServer
    .post('/')
    .withJsonBodyIncluding({
      jsonrpc: '2.0',
      method,
      params,
    })
    .withHeaders(withHeaders || {})
    .thenReply(
      200,
      JSON.stringify({
        jsonrpc: '2.0',
        id: '',
        error,
        result,
      }),
    );
};

export const airdrop = async ({
  connection,
  address,
  amount,
}: {
  connection: Connection;
  address: PublicKey;
  amount: number;
}) => {
  await mockRpcResponse({
    method: 'requestAirdrop',
    params: [address.toBase58(), amount],
    value: uniqueSignature(),
  });

  const signature = await connection.requestAirdrop(address, amount);

  await mockRpcMessage({
    method: 'signatureSubscribe',
    params: [signature, {commitment: 'confirmed'}],
    result: {err: null},
  });

  await connection.confirmTransaction(signature, 'confirmed');
  return signature;
};
