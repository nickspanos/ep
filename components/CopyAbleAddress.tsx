import {CopyToClipboard} from 'react-copy-to-clipboard';
import React, {useState} from "react";

export function collapseAddress(address: string) {
    return `${address.substring(0, 7)}...${address.substring(address.length-8, address.length-1)}`
}

export const CopyAbleAddress: React.FC<{address: string; signerAddress?: string;className?: string;}> = ({ address, signerAddress, className } = {
    address: '',
    signerAddress: undefined
}) => {
    const [copied, setCopied] = useState(false);
    const listener = () => {
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 5000);
    }
    return (
        <CopyToClipboard text={address} onCopy={listener}>
            <span className={`secret-code text-warning ${className}`}>
                {address && ((signerAddress && signerAddress.toLowerCase() === address.toLowerCase())?'Me':collapseAddress(address))}
                {copied && <span className="font-weight-bold text-warning">...Copied</span>}
            </span>
        </CopyToClipboard>
    )
}