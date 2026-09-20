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
} from 'react-icons/hi';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl, getInitials } from '../utils/imageUrl';

const SAMPLE_AVATARS = [
  { label: 'Electrician', url: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80' },
  { label: 'Painter', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
  { label: 'Plumber', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { label: 'Carpenter', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
];

const Profile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: '', location: user?.location || '' });
  const [workerForm, setWorkerForm] = useState({ bio: '', experience: '', service_type: '' });
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);

  // Avatar upload states
  const [imageTab, setImageTab] = useState('file'); // 'file' | 'url'
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
        setForm({
          name: data.user.name,
          phone: data.user.phone || '',
          location: data.user.location || '',
        });
        const currentAvatar = data.user.avatar || data.workerProfile?.avatar || '';
        setAvatar(currentAvatar);

        if (data.workerProfile) {
          setWorkerForm({
            bio: data.workerProfile.bio || '',
            experience: data.workerProfile.experience || '',
            service_type: data.workerProfile.service_type || '',
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile info', err);
      }
    };
    fetchMe();
  }, []);

  // Cleanup any created object URLs on unmount or file change
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
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange(file);
  };

  const cancelSelectedFile = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Upload file avatar
  const handleUploadFile = async () => {
    if (!selectedFile) {
      toast.error('Please select an image file first');
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      const endpoint = user?.role === 'worker' ? '/workers/me/avatar' : '/users/me/avatar';
      const { data } = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const newUrl = data.avatar || data.profileImage || '';
      setAvatar(newUrl);
      setSelectedFile(null);
      setPreviewUrl('');
      setImageLoadError(false);

      if (user) {
        setUser({ ...user, avatar: newUrl });
      }

      toast.success('Worker profile image uploaded successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload profile image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Save image via URL
  const handleSaveUrl = async (customUrl) => {
    const targetUrl = (customUrl || imageUrlInput).trim();
    if (!targetUrl) {
      toast.error('Please enter an image URL');
      return;
    }

    setUploadingImage(true);
    try {
      const endpoint = user?.role === 'worker' ? '/workers/me/avatar' : '/users/me/avatar';
      const { data } = await api.post(endpoint, { avatar_url: targetUrl });

      const newUrl = data.avatar || data.profileImage || targetUrl;
      setAvatar(newUrl);
      setImageUrlInput('');
      setPreviewUrl('');
      setImageLoadError(false);

      if (user) {
        setUser({ ...user, avatar: newUrl });
      }

      toast.success('Worker profile image updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile image');
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
      toast.success('Worker profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const currentDisplayImage = previewUrl || avatar;

  return (
    <div className="max-w-2xl mx-auto px-5 md:px-8 py-14">
      <span className="font-mono text-xs tracking-widest text-hazard">// ACCOUNT SETTINGS</span>
      <h1 className="font-display font-bold text-4xl mt-2 mb-8">
        {user?.role === 'worker' ? 'Worker Profile & Image' : 'Your Profile'}
      </h1>

      {/* Profile Photo Management Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="ticket p-7 shadow-card mb-8 border border-ink/10"
      >
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-hazard/15 text-hazard">
              <HiOutlineCamera className="text-xl" />
            </span>
            <div>
              <h2 className="font-display font-bold text-xl leading-tight">
                {user?.role === 'worker' ? 'Worker Profile Photo' : 'Profile Photo'}
              </h2>
              <p className="text-xs text-ink/60">
                {user?.role === 'worker'
                  ? 'Your photo will be featured on the dispatch board, worker cards, and booking tickets.'
                  : 'Your avatar helps workers and support recognize your account.'}
              </p>
            </div>
          </div>
          {avatar && (
            <span className="stamp text-[11px] font-mono font-bold text-signal px-2 py-0.5 border-signal/30">
              ACTIVE PHOTO
            </span>
          )}
        </div>

        {/* Current Image & Preview Showcase */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-4 rounded-xl bg-concrete/60 border border-ink/10">
          <div className="relative group shrink-0">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-ink/15 shadow-card bg-dispatch flex items-center justify-center relative">
              {currentDisplayImage && !imageLoadError ? (
                <img
                  src={getAvatarUrl(currentDisplayImage)}
                  alt={form.name || 'Worker avatar'}
                  className="w-full h-full object-cover"
                  onError={() => setImageLoadError(true)}
                />
              ) : (
                <span className="font-display font-bold text-4xl text-concrete">
                  {getInitials(form.name || user?.name)}
                </span>
              )}
            </div>

            {/* Quick trigger to open file dialog on click */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-2xl bg-ink/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
              title="Click to choose a new photo"
            >
              <HiOutlineCamera className="text-2xl mb-1 text-hazard" />
              <span className="text-[11px] font-bold font-mono">CHANGE</span>
            </button>
          </div>

          <div className="flex-1 space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="font-display font-bold text-lg">{form.name || user?.name}</span>
              {user?.role === 'worker' && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-hazard text-ink font-bold">
                  {workerForm.service_type || 'Worker'}
                </span>
              )}
            </div>
            <p className="text-xs text-ink/60">
              Recommended: Square JPG, PNG, or WebP portrait. Max 5MB.
            </p>

            {previewUrl && (
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono text-hazard font-semibold">
                <span className="w-2 h-2 rounded-full bg-hazard animate-pulse" />
                Unsaved preview active
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-ink/20 text-xs font-bold hover:bg-ink hover:text-concrete transition-colors"
              >
                <HiOutlinePhotograph /> Choose from files
              </button>

              {(avatar || previewUrl) && (
                <button
                  type="button"
                  disabled={uploadingImage}
                  onClick={previewUrl && !avatar ? cancelSelectedFile : handleRemoveAvatar}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-alert/30 text-alert text-xs font-bold hover:bg-alert hover:text-white transition-colors disabled:opacity-50"
                >
                  <HiOutlineTrash /> {previewUrl && !selectedFile ? 'Clear preview' : 'Remove photo'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Upload Mode Selector (Tabs) */}
        <div className="pt-2">
          <div className="flex border-b border-ink/10 mb-4">
            <button
              type="button"
              onClick={() => setImageTab('file')}
              className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold transition-all border-b-2 ${
                imageTab === 'file'
                  ? 'border-hazard text-ink'
                  : 'border-transparent text-ink/50 hover:text-ink'
              }`}
            >
              <HiOutlineUpload className="text-sm" /> Upload image file
            </button>
            <button
              type="button"
              onClick={() => setImageTab('url')}
              className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold transition-all border-b-2 ${
                imageTab === 'url'
                  ? 'border-hazard text-ink'
                  : 'border-transparent text-ink/50 hover:text-ink'
              }`}
            >
              <HiOutlineLink className="text-sm" /> Enter image URL
            </button>
          </div>

          <AnimatePresence mode="wait">
            {imageTab === 'file' ? (
              <motion.div
                key="tab-file"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="space-y-4"
              >
                {/* Drag and Drop Zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-6 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all duration-200 ${
                    dragOver
                      ? 'border-hazard bg-hazard/10 scale-[0.99]'
                      : selectedFile
                      ? 'border-signal/50 bg-signal/5'
                      : 'border-ink/20 hover:border-hazard hover:bg-concrete/40'
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
                    <div className="w-12 h-12 rounded-full bg-hazard/15 text-hazard flex items-center justify-center text-2xl mb-3">
                      <HiOutlineUpload />
                    </div>
                    {selectedFile ? (
                      <div>
                        <p className="font-semibold text-sm text-ink">{selectedFile.name}</p>
                        <p className="text-xs font-mono text-ink/50 mt-0.5">
                          {(selectedFile.size / 1024).toFixed(1)} KB · Ready to save
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-semibold text-sm text-ink">
                          Drag & drop your photo here, or <span className="text-hazard underline">browse</span>
                        </p>
                        <p className="text-xs text-ink/50 mt-1">JPEG, PNG, WebP or GIF up to 5MB</p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedFile && (
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <button
                      type="button"
                      onClick={cancelSelectedFile}
                      className="px-4 py-2 rounded-lg border border-ink/20 text-xs font-semibold hover:bg-ink/5"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={handleUploadFile}
                      className="flex-1 py-2.5 px-4 rounded-lg bg-hazard text-ink font-bold text-sm hover:bg-ink hover:text-hazard transition-colors flex items-center justify-center gap-2 shadow-card"
                    >
                      {uploadingImage ? (
                        <>
                          <span className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                          Uploading photo…
                        </>
                      ) : (
                        <>
                          <HiOutlineCheckCircle className="text-lg" />
                          Save & Update Profile Photo
                        </>
                      )}
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="tab-url"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-semibold text-ink/80 block mb-1">Direct Image URL</label>
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
                      className="flex-1 border border-ink/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-hazard bg-transparent"
                    />
                    <button
                      type="button"
                      disabled={uploadingImage || !imageUrlInput.trim()}
                      onClick={() => handleSaveUrl()}
                      className="px-5 py-2 rounded-lg bg-hazard text-ink font-bold text-sm hover:bg-ink hover:text-hazard transition-colors disabled:opacity-40"
                    >
                      {uploadingImage ? 'Saving…' : 'Save URL'}
                    </button>
                  </div>
                </div>

                {/* Sample avatars for quick testing */}
                <div>
                  <span className="text-[11px] font-mono text-ink/50 uppercase tracking-wide block mb-2">
                    Or select a professional trade preset:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {SAMPLE_AVATARS.map((s) => (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => {
                          setImageUrlInput(s.url);
                          setPreviewUrl(s.url);
                          setImageLoadError(false);
                        }}
                        className="flex items-center gap-2 p-2 rounded-lg border border-ink/10 hover:border-hazard hover:bg-hazard/5 transition-all text-left group"
                      >
                        <img
                          src={s.url}
                          alt={s.label}
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                        <span className="text-xs font-semibold text-ink/80 group-hover:text-ink truncate">
                          {s.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Basic Account Info Form */}
      <motion.form
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        onSubmit={saveProfile}
        className="ticket p-7 shadow-card space-y-4 mb-8"
      >
        <h2 className="font-display font-bold text-xl mb-2">Basic info</h2>
        <div>
          <label className="text-sm font-semibold">Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full border border-ink/15 rounded-lg px-3 py-2.5 outline-none focus:border-hazard bg-transparent"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Phone</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="mt-1 w-full border border-ink/15 rounded-lg px-3 py-2.5 outline-none focus:border-hazard bg-transparent"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Location</label>
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="mt-1 w-full border border-ink/15 rounded-lg px-3 py-2.5 outline-none focus:border-hazard bg-transparent"
          />
        </div>
        <button
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-hazard font-bold hover:bg-ink hover:text-hazard transition-colors"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </motion.form>

      {/* Worker Details Form */}
      {user?.role === 'worker' && (
        <motion.form
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={saveWorkerProfile}
          className="ticket p-7 shadow-card space-y-4"
        >
          <h2 className="font-display font-bold text-xl mb-2">Worker details</h2>
          <div>
            <label className="text-sm font-semibold">Primary trade</label>
            <input
              value={workerForm.service_type}
              onChange={(e) => setWorkerForm({ ...workerForm, service_type: e.target.value })}
              className="mt-1 w-full border border-ink/15 rounded-lg px-3 py-2.5 outline-none focus:border-hazard bg-transparent"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Experience</label>
            <input
              value={workerForm.experience}
              onChange={(e) => setWorkerForm({ ...workerForm, experience: e.target.value })}
              className="mt-1 w-full border border-ink/15 rounded-lg px-3 py-2.5 outline-none focus:border-hazard bg-transparent"
              placeholder="e.g. 5-8 years"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Bio</label>
            <textarea
              rows={4}
              value={workerForm.bio}
              onChange={(e) => setWorkerForm({ ...workerForm, bio: e.target.value })}
              className="mt-1 w-full border border-ink/15 rounded-lg px-3 py-2.5 outline-none focus:border-hazard bg-transparent resize-none"
            />
          </div>
          <button
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-ink text-concrete font-bold hover:bg-hazard hover:text-ink transition-colors"
          >
            {saving ? 'Saving…' : 'Update worker profile'}
          </button>
        </motion.form>
      )}
    </div>
  );
};

export default Profile;

