import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  BatchMetadataUpdate,
  LevelUpEvent,
  MetadataUpdate,
  OwnershipTransferRequested,
  OwnershipTransferred,
  PlayerAdded,
  RequestFulfilled,
  RequestSent,
  Transfer,
  WeHaveAWinner,
  newGameSessionStarted
} from "../generated/CharacterCollector/CharacterCollector"

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createBatchMetadataUpdateEvent(
  _fromTokenId: BigInt,
  _toTokenId: BigInt
): BatchMetadataUpdate {
  let batchMetadataUpdateEvent = changetype<BatchMetadataUpdate>(newMockEvent())

  batchMetadataUpdateEvent.parameters = new Array()

  batchMetadataUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "_fromTokenId",
      ethereum.Value.fromUnsignedBigInt(_fromTokenId)
    )
  )
  batchMetadataUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "_toTokenId",
      ethereum.Value.fromUnsignedBigInt(_toTokenId)
    )
  )

  return batchMetadataUpdateEvent
}

export function createLevelUpEventEvent(
  owner: Address,
  characterName: string,
  currentLevel: BigInt,
  gameSession: BigInt
): LevelUpEvent {
  let levelUpEventEvent = changetype<LevelUpEvent>(newMockEvent())

  levelUpEventEvent.parameters = new Array()

  levelUpEventEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  levelUpEventEvent.parameters.push(
    new ethereum.EventParam(
      "characterName",
      ethereum.Value.fromString(characterName)
    )
  )
  levelUpEventEvent.parameters.push(
    new ethereum.EventParam(
      "currentLevel",
      ethereum.Value.fromUnsignedBigInt(currentLevel)
    )
  )
  levelUpEventEvent.parameters.push(
    new ethereum.EventParam(
      "gameSession",
      ethereum.Value.fromUnsignedBigInt(gameSession)
    )
  )

  return levelUpEventEvent
}

export function createMetadataUpdateEvent(_tokenId: BigInt): MetadataUpdate {
  let metadataUpdateEvent = changetype<MetadataUpdate>(newMockEvent())

  metadataUpdateEvent.parameters = new Array()

  metadataUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "_tokenId",
      ethereum.Value.fromUnsignedBigInt(_tokenId)
    )
  )

  return metadataUpdateEvent
}

export function createOwnershipTransferRequestedEvent(
  from: Address,
  to: Address
): OwnershipTransferRequested {
  let ownershipTransferRequestedEvent =
    changetype<OwnershipTransferRequested>(newMockEvent())

  ownershipTransferRequestedEvent.parameters = new Array()

  ownershipTransferRequestedEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  ownershipTransferRequestedEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )

  return ownershipTransferRequestedEvent
}

export function createOwnershipTransferredEvent(
  from: Address,
  to: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )

  return ownershipTransferredEvent
}

export function createPlayerAddedEvent(
  owner: Address,
  characterName: string,
  currentLevel: BigInt,
  gameSession: BigInt
): PlayerAdded {
  let playerAddedEvent = changetype<PlayerAdded>(newMockEvent())

  playerAddedEvent.parameters = new Array()

  playerAddedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  playerAddedEvent.parameters.push(
    new ethereum.EventParam(
      "characterName",
      ethereum.Value.fromString(characterName)
    )
  )
  playerAddedEvent.parameters.push(
    new ethereum.EventParam(
      "currentLevel",
      ethereum.Value.fromUnsignedBigInt(currentLevel)
    )
  )
  playerAddedEvent.parameters.push(
    new ethereum.EventParam(
      "gameSession",
      ethereum.Value.fromUnsignedBigInt(gameSession)
    )
  )

  return playerAddedEvent
}

export function createRequestFulfilledEvent(
  requestId: BigInt,
  randomWords: Array<BigInt>,
  payment: BigInt
): RequestFulfilled {
  let requestFulfilledEvent = changetype<RequestFulfilled>(newMockEvent())

  requestFulfilledEvent.parameters = new Array()

  requestFulfilledEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromUnsignedBigInt(requestId)
    )
  )
  requestFulfilledEvent.parameters.push(
    new ethereum.EventParam(
      "randomWords",
      ethereum.Value.fromUnsignedBigIntArray(randomWords)
    )
  )
  requestFulfilledEvent.parameters.push(
    new ethereum.EventParam(
      "payment",
      ethereum.Value.fromUnsignedBigInt(payment)
    )
  )

  return requestFulfilledEvent
}

export function createRequestSentEvent(
  tokenId: BigInt,
  requestId: BigInt,
  numWords: BigInt
): RequestSent {
  let requestSentEvent = changetype<RequestSent>(newMockEvent())

  requestSentEvent.parameters = new Array()

  requestSentEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  requestSentEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromUnsignedBigInt(requestId)
    )
  )
  requestSentEvent.parameters.push(
    new ethereum.EventParam(
      "numWords",
      ethereum.Value.fromUnsignedBigInt(numWords)
    )
  )

  return requestSentEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}

export function createWeHaveAWinnerEvent(
  tokenId: BigInt,
  owner: Address,
  characterName: string,
  gameSession: BigInt
): WeHaveAWinner {
  let weHaveAWinnerEvent = changetype<WeHaveAWinner>(newMockEvent())

  weHaveAWinnerEvent.parameters = new Array()

  weHaveAWinnerEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  weHaveAWinnerEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  weHaveAWinnerEvent.parameters.push(
    new ethereum.EventParam(
      "characterName",
      ethereum.Value.fromString(characterName)
    )
  )
  weHaveAWinnerEvent.parameters.push(
    new ethereum.EventParam(
      "gameSession",
      ethereum.Value.fromUnsignedBigInt(gameSession)
    )
  )

  return weHaveAWinnerEvent
}

export function createnewGameSessionStartedEvent(
  gameSession: BigInt
): newGameSessionStarted {
  let newGameSessionStartedEvent =
    changetype<newGameSessionStarted>(newMockEvent())

  newGameSessionStartedEvent.parameters = new Array()

  newGameSessionStartedEvent.parameters.push(
    new ethereum.EventParam(
      "gameSession",
      ethereum.Value.fromUnsignedBigInt(gameSession)
    )
  )

  return newGameSessionStartedEvent
}
