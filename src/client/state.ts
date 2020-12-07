import { atom } from 'jotai'

import { web3modal } from './ethereum'
import type { ConnectedEthereumProvider } from './ethereum'
import { createIDXEnv } from './idx'
import type { KnownDIDs } from './idx'

export type EthereumProviderState =
  | { status: 'DISCONNECTED' }
  | ({ status: 'CONNECTED' } & ConnectedEthereumProvider)
  | { status: 'CONNECTING'; promise: Promise<ConnectedEthereumProvider | null> }
  | { status: 'FAILED'; error?: Error }

export const ethereumProviderAtom = atom<EthereumProviderState>({ status: 'DISCONNECTED' })

const KNOWN_DIDS_KEY = 'selfID-knownDIDs-v0'
const SELECTED_DID_KEY = 'selfID-selectedDID-v0'

function getKnownDIDs(): KnownDIDs {
  const item = localStorage.getItem(KNOWN_DIDS_KEY)
  return (item ? JSON.parse(item) : {}) as KnownDIDs
}
function setKnownDIDs(dids: KnownDIDs = {}): void {
  return localStorage.setItem(KNOWN_DIDS_KEY, JSON.stringify(dids))
}

export const knownDIDsAtom = atom(getKnownDIDs(), (_get, set, dids: KnownDIDs) => {
  setKnownDIDs(dids)
  set(knownDIDsAtom, dids)
})

export type IDXAuth =
  | { state: 'UNKNOWN'; id?: undefined }
  | { state: 'LOCAL'; id: string }
  | { state: 'LOADING'; id?: string }
  | { state: 'ERROR'; id?: string; error?: Error }
  | { state: 'CONFIRMED'; id: string; address: string }

function getAuthState(): IDXAuth {
  const id = localStorage.getItem(SELECTED_DID_KEY) || null
  return id ? { state: 'LOCAL', id } : { state: 'UNKNOWN' }
}

export const idxAuthAtom = atom(getAuthState(), (_get, set, auth: IDXAuth) => {
  if (auth.id == null) {
    localStorage.removeItem(SELECTED_DID_KEY)
  } else {
    localStorage.setItem(SELECTED_DID_KEY, auth.id)
  }
  set(idxAuthAtom, auth)
})

export const idxEnvAtom = atom(createIDXEnv(), (get, set, _) => {
  web3modal.clearCachedProvider()
  const existing = get(idxEnvAtom)
  set(idxEnvAtom, createIDXEnv(existing))
})

export const linkingAddressAtom = atom<string | null>(null)