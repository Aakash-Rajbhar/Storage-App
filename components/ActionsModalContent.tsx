import React, { useState } from 'react';
import { Models } from 'node-appwrite';
import Thumbnail from './Thumbnail';
import FormattedDateTime from './FormattedDateTime';
import { convertFileSize, formatDateTime } from '@/lib/utils';
import { Input } from './ui/input';
import { Button } from './ui/button';
import Image from 'next/image';

const ImageThumbnail = ({ file }: { file: Models.Document }) => (
  <div className="file-details-thumbnail">
    <Thumbnail type={file.type} extension={file.extension} url={file.url} />
    <div className="flex flex-col ">
      <p className="subtitle-2 mb-1">{file.name}</p>
      <FormattedDateTime date={file.$createdAt} className="caption" />
    </div>
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-4">
    <p className="file-details-label text-left">{label}</p>
    <p className="file-details-value text-left">{value}</p>
  </div>
);

export const FileDetails = ({ file }: { file: Models.Document }) => {
  const [copySuccess, setCopySuccess] = useState('');

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(file.url)
      .then(() => setCopySuccess('Link copied!'))
      .catch(() => setCopySuccess('Failed to copy link.'));
    setTimeout(() => setCopySuccess(''), 3000); // Reset success message after 2 seconds
  };

  return (
    <>
      <ImageThumbnail file={file} />
      <div className="space-y-4 px-2 pt-2">
        <DetailRow label="Format:" value={file.extension} />
        <DetailRow label="Size:" value={convertFileSize(file.size)} />
        <DetailRow label="Owner:" value={file.owner.fullName} />
        <DetailRow
          label="Last Updated:"
          value={formatDateTime(file.$updatedAt)}
        />
        <div className="mt-4 flex items-center justify-between">
          <Button onClick={handleCopyLink} className="rounded-full">
            Copy Link
          </Button>
          {copySuccess && <p className="text-teal-500">{copySuccess}</p>}
        </div>
      </div>
    </>
  );
};

interface Props {
  file: Models.Document;
  onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
  onRemove: (email: string) => void;
}
export const ShareInput = ({ file, onInputChange, onRemove }: Props) => {
  const [copySuccess, setCopySuccess] = useState('');

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(file.url)
      .then(() => setCopySuccess('Link copied!'))
      .catch(() => setCopySuccess('Failed to copy link.'));
    setTimeout(() => setCopySuccess(''), 3000); // Reset success message after 2 seconds
  };

  return (
    <>
      <ImageThumbnail file={file} />
      <div className="share-wrapper">
        <p className="subtitle-2 pl-1 text-light-100">
          Share file with other users
        </p>
        <Input
          type="email"
          placeholder="Enter email address"
          onChange={(e) => onInputChange(e.target.value.trim().split(','))}
          className="share-input-field"
        />
        <div>
          <p className="subtitle-2 mt-4 text-light-100">Share via</p>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center justify-start gap-3">
              <Button onClick={handleCopyLink} className="rounded-full">
                Copy Link
              </Button>
              <Image
                src="/assets/icons/whatsapp.svg"
                alt="whatsapp"
                width={44}
                height={44}
                onClick={() => {
                  const whatsappMessage = `Check out this file: ${file.url}`;
                  const whatsappURL = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
                  window.open(whatsappURL, '_blank');
                }}
                className=" cursor-pointer "
              />
            </div>
            {copySuccess && <p className="mt-2 text-teal-500">{copySuccess}</p>}
          </div>
        </div>
        <div className="pt-4 ">
          <div className="flex justify-between">
            <p className="subtitle-2 text-light-100">Shared With</p>
            <p className="subtitle-2 text-light-200">
              {file.users.length} users
            </p>
          </div>
          <ul className="pt-2 ">
            {file.users.map((email: string) => (
              <li
                key={email}
                className="flex items-center justify-between gap-2"
              >
                <p className="subtitle-2">{email}</p>
                <Button
                  onClick={() => onRemove(email)}
                  className="share-remove-user"
                >
                  <Image
                    src={'/assets/icons/remove.svg'}
                    alt="remove"
                    width={24}
                    height={24}
                    className="remove-icon"
                  />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
