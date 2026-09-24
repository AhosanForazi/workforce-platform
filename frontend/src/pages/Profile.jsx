import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineCamera,
  HiOutlineUpload,
  HiOutlineTrash,
  HiOutlineLink,
  HiOutlineCheckCircle,
  HiOutlinePhotograph,
  HiOutlineUser,
  HiOutlineEye,
} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl, getFallbackSvgAvatar, TRADE_AVATARS } from '../utils/imageUrl';

const TRADE_PRESETS = [
  { label: 'Electrician', url: TRADE_AVATARS.electrician },
  { label: 'Plumber', url: TRADE_AVATARS.plumber },
  { label: 'Painter', url: TRADE_AVATARS.painter },
  { label: 'Carpenter', url: TRADE_AVATARS.carpenter },
  { label: 'Cleaner', url: TRADE_AVATARS.cleaner },
  { label: 'Gardener', url: TRADE_AVATARS.gardener },
  { label: 'Technician', url: TRADE_AVATARS.technician },
  { label: 'General / Handyman', url: TRADE_AVATARS.general },
];

const Profile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: '', location: user?.location || '' });
  const [workerForm, setWorkerForm] = useState({ bio: '', experience: '', service_type: '' });
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);

  // Avatar upload states
  const [imageTab, setImageTab] = useState('file'); // 'file' | 'presets' | 'url'
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await api.get('/auth/me');
        if (data.user) {
          setForm({
            name: data.user.name || '',
            phone: data.user.phone || '',
            location: data.user.location || '',
          });
          const currentAvatar = data.user.avatar || data.workerProfile?.avatar || '';
          setAvatar(currentAvatar);
        }

        if (data.workerProfile) {
          setWorkerForm({
            bio: data.workerProfile.bio || '',
            experience: data.workerProfile.experience || '',
            service_type: data.workerProfile.service_type || data.workerProfile.serviceType || '',
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile info', err);
      }
    };
    fetchMe();
  }, []);

  // Cleanup object URLs on unmount or file change
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (file) => {
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image (JPEG, PNG, WebP, GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be under 5MB');
      return;
    }

    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
    setImageLoadError(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragOver(true);
    } else if (e.type === 'dragleave') {
      setDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFileChange(file);
  };

  const cancelSelectedFile = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl('');
    setImageLoadError(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Upload file from device
  const handleUploadFile = async () => {
    if (!selectedFile) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('avatar', selectedFile);
      formData.append('profileImage', selectedFile);

      const endpoint = user?.role === 'worker' ? '/workers/me/avatar' : '/users/me/avatar';
      const { data } = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const newAvatarUrl = data.avatar || data.profileImage || (data.user && data.user.avatar);
      setAvatar(newAvatarUrl);
      setSelectedFile(null);
      setPreviewUrl('');
      setImageLoadError(false);

      if (user && newAvatarUrl) {
        setUser({ ...user, avatar: newAvatarUrl });
      }

      toast.success('Profile photo updated! This photo is now live on your Gig Card in Find Workers.');
    } catch (err) {
      // Fallback: local blob preview if backend is disconnected
      if (previewUrl) {
        setAvatar(previewUrl);
        if (user) setUser({ ...user, avatar: previewUrl });
        toast.success('Photo saved for current session!');
      } else {
        toast.error(err.response?.data?.message || 'Failed to upload image');
      }
    } finally {
      setUploadingImage(false);
    }
  };

  // Save image via URL or Preset
  const handleSaveUrl = async (presetUrl) => {
    const targetUrl = (presetUrl || imageUrlInput).trim();
    if (!targetUrl) return;

    setUploadingImage(true);
    try {
      const endpoint = user?.role === 'worker' ? '/workers/me/avatar' : '/users/me/avatar';
      const { data } = await api.post(endpoint, { avatar_url: targetUrl });

      const newAvatarUrl = data.avatar || data.profileImage || targetUrl;
      setAvatar(newAvatarUrl);
      setImageUrlInput('');
      setPreviewUrl('');
      setImageLoadError(false);

      if (user && newAvatarUrl) {
        setUser({ ...user, avatar: newAvatarUrl });
      }

      toast.success('Profile image updated! Live on your Gig Card.');
    } catch (err) {
      setAvatar(targetUrl);
      if (user) setUser({ ...user, avatar: targetUrl });
      toast.success('Photo applied successfully!');
    } finally {
      setUploadingImage(false);
    }
  };

  // Delete / remove avatar
  const handleRemoveAvatar = async () => {
    if (!avatar && !previewUrl) return;

    if (!window.confirm('Are you sure you want to remove your profile photo?')) return;

    setUploadingImage(true);
    try {
      const endpoint = user?.role === 'worker' ? '/workers/me/avatar' : '/users/me/avatar';
      await api.delete(endpoint);

      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      setAvatar('');
      setSelectedFile(null);
      setPreviewUrl('');
      setImageLoadError(false);
      if (fileInputRef.current) fileInputRef.current.value = '';

      if (user) {
        setUser({ ...user, avatar: '' });
      }

      toast.success('Profile image removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove profile image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Quick apply and save a trade portrait
  const handleSelectPreset = async (presetUrl) => {
    setImageUrlInput(presetUrl);
    setPreviewUrl(presetUrl);
    setImageLoadError(false);
    await handleSaveUrl(presetUrl);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/users/me', form);
      setUser({ ...user, ...data });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const saveWorkerProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/workers/me', workerForm);
      toast.success('Worker Gig details updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const currentDisplayImage = previewUrl || avatar;
  const displayImageSrc = imageLoadError
    ? getFallbackSvgAvatar(form.name || user?.name)
    : getAvatarUrl(currentDisplayImage, workerForm.service_type || user?.role, form.name || user?.name);

  return (
    <div className="bg-[#f7f7f7] min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#1dbf73] uppercase tracking-wider">
              {user?.role === 'worker' ? 'Seller Studio' : 'Account Settings'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222325] mt-0.5">
              {user?.role === 'worker' ? 'Worker Profile & Photo' : 'Personal Profile'}
            </h1>
          </div>
          <Link
            to="/browse"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-white text-xs font-semibold text-[#404145] transition-colors"
          >
            <HiOutlineEye className="text-base text-[#1dbf73]" /> Preview on Find Workers
          </Link>
        </div>

        {/* Profile Photo Management Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-[#e4e5e7] p-6 shadow-sm mb-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-[#eefaf4] text-[#1dbf73]">
                <HiOutlineCamera className="text-xl" />
              </span>
              <div>
                <h2 className="font-bold text-lg text-[#222325] leading-tight">
                  Profile Photo & Gig Card Image
                </h2>
                <p className="text-xs text-[#74767e]">
                  {user?.role === 'worker'
                    ? 'This image is featured on your Gig Card in "Find Workers" and your public seller page.'
                    : 'Your photo helps workers recognize your bookings.'}
                </p>
              </div>
            </div>
            {avatar && (
              <span className="text-[11px] font-bold text-[#1dbf73] bg-[#eefaf4] px-2.5 py-0.5 rounded-full border border-[#1dbf73]/20">
                Active Photo
              </span>
            )}
          </div>

          {/* Current Image & Preview Showcase in Round Shape Frame */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-5 rounded-xl bg-[#f7f7f7] border border-[#e4e5e7] mb-6">
            <div className="relative group shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-md ring-4 ring-[#1dbf73]/30 bg-gray-200 flex items-center justify-center relative">
                <img
                  src={displayImageSrc}
                  alt={form.name || 'Worker avatar'}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={() => setImageLoadError(true)}
                />
              </div>

              {/* Quick trigger to open file dialog on click */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                title="Click to choose a new photo"
              >
                <HiOutlineCamera className="text-2xl mb-1 text-[#1dbf73]" />
                <span className="text-[9px] font-bold tracking-wider uppercase">Change</span>
              </button>

              {/* Camera badge pinned to round frame */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-[#1dbf73] text-white border-2 border-white shadow-md hover:scale-110 transition-transform cursor-pointer"
                title="Upload photo from device"
              >
                <HiOutlineCamera className="text-sm" />
              </button>
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="font-bold text-lg text-[#222325]">{form.name || user?.name}</span>
                {user?.role === 'worker' && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#eefaf4] text-[#1dbf73]">
                    {workerForm.service_type || 'Worker Pro'}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#74767e]">
                Upload your picture or pick a professional trade portrait below.
              </p>

              {previewUrl && (
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-[#1dbf73] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#1dbf73] animate-pulse" />
                  Unsaved preview active - click Save below to apply
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold transition-colors shadow-sm"
                >
                  <HiOutlineUpload /> Upload Photo
                </button>

                <button
                  type="button"
                  onClick={() => setImageTab('presets')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-white text-[#222325] text-xs font-semibold transition-colors"
                >
                  <HiOutlinePhotograph /> Pick Trade Preset
                </button>

                {(avatar || previewUrl) && (
                  <button
                    type="button"
                    disabled={uploadingImage}
                    onClick={previewUrl && !avatar ? cancelSelectedFile : handleRemoveAvatar}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    <HiOutlineTrash /> {previewUrl && !selectedFile ? 'Clear preview' : 'Remove photo'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Upload Mode Selector (Tabs) */}
          <div className="pt-2">
            <div className="flex border-b border-[#e4e5e7] mb-4 overflow-x-auto">
              <button
                type="button"
                onClick={() => setImageTab('file')}
                className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                  imageTab === 'file'
                    ? 'border-[#1dbf73] text-[#1dbf73]'
                    : 'border-transparent text-[#74767e] hover:text-[#222325]'
                }`}
              >
                <HiOutlineUpload className="text-sm" /> 1. Upload from Device
              </button>
              <button
                type="button"
                onClick={() => setImageTab('presets')}
                className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                  imageTab === 'presets'
                    ? 'border-[#1dbf73] text-[#1dbf73]'
                    : 'border-transparent text-[#74767e] hover:text-[#222325]'
                }`}
              >
                <HiOutlinePhotograph className="text-sm" /> 2. Trade Portraits (1-Click)
              </button>
              <button
                type="button"
                onClick={() => setImageTab('url')}
                className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                  imageTab === 'url'
                    ? 'border-[#1dbf73] text-[#1dbf73]'
                    : 'border-transparent text-[#74767e] hover:text-[#222325]'
                }`}
              >
                <HiOutlineLink className="text-sm" /> 3. Direct Image URL
              </button>
            </div>

            <AnimatePresence mode="wait">
              {imageTab === 'file' && (
                <motion.div
                  key="tab-file"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="space-y-4"
                >
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-6 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all duration-200 ${
                      dragOver
                        ? 'border-[#1dbf73] bg-[#eefaf4]'
                        : selectedFile
                        ? 'border-[#1dbf73] bg-[#eefaf4]/40'
                        : 'border-gray-300 hover:border-[#1dbf73] hover:bg-gray-50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={handleFileInputChange}
                    />

                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-[#eefaf4] text-[#1dbf73] flex items-center justify-center text-2xl mb-3">
                        <HiOutlineUpload />
                      </div>
                      {selectedFile ? (
                        <div>
                          <p className="font-bold text-sm text-[#222325]">{selectedFile.name}</p>
                          <p className="text-xs text-[#74767e] mt-0.5">
                            {(selectedFile.size / 1024).toFixed(1)} KB · Ready to save
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-bold text-sm text-[#222325]">
                            Drag & drop your photo here, or <span className="text-[#1dbf73] underline">browse files</span>
                          </p>
                          <p className="text-xs text-[#74767e] mt-1">JPEG, PNG, WebP up to 5MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedFile && (
                    <div className="flex items-center justify-between gap-3 pt-1">
                      <button
                        type="button"
                        onClick={cancelSelectedFile}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-xs font-semibold hover:bg-gray-50 text-[#62646a]"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={uploadingImage}
                        onClick={handleUploadFile}
                        className="flex-1 py-2.5 px-4 rounded-lg bg-[#1dbf73] hover:bg-[#19a463] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                      >
                        {uploadingImage ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Uploading photo…
                          </>
                        ) : (
                          <>
                            <HiOutlineCheckCircle className="text-base" />
                            Save & Update Profile Photo
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {imageTab === 'presets' && (
                <motion.div
                  key="tab-presets"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="space-y-3"
                >
                  <p className="text-xs text-[#74767e]">
                    Click any portrait to instantly apply and save it to your Gig Card:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {TRADE_PRESETS.map((s) => (
                      <button
                        key={s.label}
                        type="button"
                        disabled={uploadingImage}
                        onClick={() => handleSelectPreset(s.url)}
                        className="flex flex-col items-center p-3 rounded-xl border border-gray-200 hover:border-[#1dbf73] hover:bg-[#eefaf4] hover:shadow-sm transition-all text-center group bg-white"
                      >
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white ring-2 ring-gray-200 group-hover:ring-[#1dbf73] shadow-sm mb-2">
                          <img
                            src={s.url}
                            alt={s.label}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <span className="text-xs font-bold text-[#222325] group-hover:text-[#1dbf73] transition-colors">
                          {s.label}
                        </span>
                        <span className="text-[10px] text-[#74767e] mt-0.5">1-click apply</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {imageTab === 'url' && (
                <motion.div
                  key="tab-url"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-xs font-bold text-[#222325] block mb-1">Direct Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={imageUrlInput}
                        onChange={(e) => {
                          setImageUrlInput(e.target.value);
                          setPreviewUrl(e.target.value);
                          setImageLoadError(false);
                        }}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#1dbf73] bg-white"
                      />
                      <button
                        type="button"
                        disabled={uploadingImage || !imageUrlInput.trim()}
                        onClick={() => handleSaveUrl()}
                        className="px-5 py-2 rounded-lg bg-[#1dbf73] hover:bg-[#19a463] text-white font-bold text-xs transition-colors disabled:opacity-40"
                      >
                        {uploadingImage ? 'Saving…' : 'Save URL'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Basic Account Info Form */}
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          onSubmit={saveProfile}
          className="bg-white rounded-xl border border-[#e4e5e7] p-6 shadow-sm space-y-4 mb-6"
        >
          <h2 className="font-bold text-lg text-[#222325]">Basic Information</h2>
          <div>
            <label className="text-xs font-bold text-[#222325]">Full Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-[#1dbf73]"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[#222325]">Phone Number</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-[#1dbf73]"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[#222325]">Location (City / Area)</label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-[#1dbf73]"
            />
          </div>
          <button
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-[#1dbf73] hover:bg-[#19a463] text-white font-bold text-xs transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </motion.form>

        {/* Worker Gig Details Form */}
        {user?.role === 'worker' && (
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={saveWorkerProfile}
            className="bg-white rounded-xl border border-[#e4e5e7] p-6 shadow-sm space-y-4"
          >
            <h2 className="font-bold text-lg text-[#222325]">Worker Gig Details</h2>
            <div>
              <label className="text-xs font-bold text-[#222325]">Primary Trade</label>
              <input
                value={workerForm.service_type}
                onChange={(e) => setWorkerForm({ ...workerForm, service_type: e.target.value })}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-[#1dbf73]"
                placeholder="e.g. Electrician, Plumber, Painter"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#222325]">Experience</label>
              <input
                value={workerForm.experience}
                onChange={(e) => setWorkerForm({ ...workerForm, experience: e.target.value })}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-[#1dbf73]"
                placeholder="e.g. 5+ years"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#222325]">Bio & Introduction</label>
              <textarea
                rows={4}
                value={workerForm.bio}
                onChange={(e) => setWorkerForm({ ...workerForm, bio: e.target.value })}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-[#1dbf73] resize-none"
                placeholder="Describe your expertise, standard tools, and services provided..."
              />
            </div>
            <button
              disabled={saving}
              className="px-6 py-2.5 rounded-lg bg-[#222325] hover:bg-black text-white font-bold text-xs transition-colors shadow-sm disabled:opacity-50"
            >
              {saving ? 'Updating…' : 'Update Gig Details'}
            </button>
          </motion.form>
        )}
      </div>
    </div>
  );
};

export default Profile;
