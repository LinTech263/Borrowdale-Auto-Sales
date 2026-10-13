import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDealership } from '../../context/DealershipContext';
import {
  getAdminVehicleById,
  saveAdminVehicle,
  computeSellingPrice,
  generateVehicleDescriptionAI
} from '../../services/dataService';
import { Vehicle, VehiclePrivate, VehicleStatus, Condition, BodyType, FuelType, Transmission, Drivetrain } from '../../types';
import { getCarSvgPlaceholder } from '../../data/seedData';
import {
  Car,
  DollarSign,
  Sparkles,
  ArrowLeft,
  Save,
  Trash2,
  Upload,
  Eye,
  CheckCircle2,
  Lock,
  History,
  Layers,
  Globe
} from 'lucide-react';

export const AdminVehicleEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories, refreshData, addToast, adminUser } = useDealership();

  const isNew = !id || id === 'new';
  const isOwner = adminUser?.role === 'owner';

  // Base Vehicle Form State
  const [stockNo, setStockNo] = useState(`BAS-${Math.floor(1000 + Math.random() * 9000)}`);
  const [make, setMake] = useState('Toyota');
  const [model, setModel] = useState('Land Cruiser 300');
  const [trim, setTrim] = useState('GR Sport 3.3D V6');
  const [year, setYear] = useState<number>(2023);
  const [title, setTitle] = useState('2023 Toyota Land Cruiser 300 GR Sport');
  const [slug, setSlug] = useState('2023-toyota-land-cruiser-300-gr-sport');
  const [condition, setCondition] = useState<Condition>('Certified');
  const [status, setStatus] = useState<VehicleStatus>('Available');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(['cat-suv']);
  const [bodyType, setBodyType] = useState<BodyType>('SUV');
  const [mileage, setMileage] = useState<number>(25000);
  const [fuel, setFuel] = useState<FuelType>('Diesel');
  const [transmission, setTransmission] = useState<Transmission>('Automatic');
  const [drivetrain, setDrivetrain] = useState<Drivetrain>('4WD');
  const [engineSize, setEngineSize] = useState('3.3L V6 Twin-Turbo Diesel');
  const [exteriorColor, setExteriorColor] = useState('Pearl White');
  const [interiorColor, setInteriorColor] = useState('Black Leather');
  const [seats, setSeats] = useState<number>(7);
  const [doors, setDoors] = useState<number>(5);
  const [location, setLocation] = useState('Borrowdale Showroom, Harare');
  const [featured, setFeatured] = useState<boolean>(true);
  const [description, setDescription] = useState('');
  const [serviceHistory, setServiceHistory] = useState('Full franchise dealer service history with stamped books.');
  const [isPriceNegotiable, setIsPriceNegotiable] = useState(true);
  const [isPriceOnRequest, setIsPriceOnRequest] = useState(false);
  const [hidePrice, setHidePrice] = useState(false);
  const [wasPrice, setWasPrice] = useState<number | ''>('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isAiDrafting, setIsAiDrafting] = useState(false);

  // SEO Fields
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Features Checklist State
  const [safetyFeatures, setSafetyFeatures] = useState<string>('Pre-Collision System, Blind Spot Monitor, 10 Airbags, Adaptive Cruise Control');
  const [comfortFeatures, setComfortFeatures] = useState<string>('Dual-Zone Climate Control, Ventilated Seats, Cool Box, Keyless Entry');
  const [techFeatures, setTechFeatures] = useState<string>('12.3-inch Touchscreen, Apple CarPlay & Android Auto, 360 Camera');
  const [exteriorFeatures, setExteriorFeatures] = useState<string>('Matrix LED Headlamps, 18-inch Alloy Wheels, Roof Rails');

  // Images state
  const [images, setImages] = useState<string[]>([
    getCarSvgPlaceholder('#C6A15B', 'Sample Front Angle'),
    getCarSvgPlaceholder('#38BDF8', 'Sample Interior Cockpit')
  ]);
  const [coverImage, setCoverImage] = useState<string>(getCarSvgPlaceholder('#C6A15B', 'Sample Cover'));

  // Private Pricing State (Admin only)
  const [vin, setVin] = useState('JTMBV0AJ504081923');
  const [costPrice, setCostPrice] = useState<number>(110000);
  const [markupType, setMarkupType] = useState<'percentage' | 'fixed'>('percentage');
  const [markupValue, setMarkupValue] = useState<number>(12); // 12%
  const [roundingRule, setRoundingRule] = useState<50 | 100 | 500>(500);
  const [manualPriceOverride, setManualPriceOverride] = useState<number | ''>('');
  const [priceHistory, setPriceHistory] = useState<any[]>([]);

  // Computed selling price
  const { computedPrice, marginAmount, marginPercent } = computeSellingPrice(
    costPrice,
    markupType,
    markupValue,
    roundingRule
  );

  const effectiveSellingPrice = typeof manualPriceOverride === 'number' && manualPriceOverride > 0
    ? manualPriceOverride
    : computedPrice;

  // Auto-generate title and slug when make, model, year changes
  useEffect(() => {
    if (isNew) {
      const generatedTitle = `${year} ${make} ${model} ${trim}`.trim();
      setTitle(generatedTitle);
      const generatedSlug = `${year}-${make}-${model}-${trim}-${stockNo}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setSlug(generatedSlug);
      setSeoTitle(`${year} ${make} ${model} for Sale in Harare | Borrowdale Auto Sales`);
      setSeoDescription(`Buy this ${year} ${make} ${model} in Borrowdale, Harare. US$${effectiveSellingPrice.toLocaleString('en-US')}, full service history, WhatsApp negotiation.`);
    }
  }, [make, model, trim, year, stockNo, isNew]);

  // Load existing vehicle if editing
  useEffect(() => {
    if (!isNew && id) {
      const data = getAdminVehicleById(id);
      if (data) {
        const { vehicle, privateData } = data;
        setStockNo(vehicle.stockNo);
        setMake(vehicle.make);
        setModel(vehicle.model);
        setTrim(vehicle.trim);
        setYear(vehicle.year);
        setTitle(vehicle.title);
        setSlug(vehicle.slug);
        setCondition(vehicle.condition);
        setStatus(vehicle.status);
        setSelectedCategoryIds(vehicle.categoryIds || []);
        setBodyType(vehicle.bodyType);
        setMileage(vehicle.mileage);
        setFuel(vehicle.fuel);
        setTransmission(vehicle.transmission);
        setDrivetrain(vehicle.drivetrain);
        setEngineSize(vehicle.engineSize);
        setExteriorColor(vehicle.exteriorColor);
        setInteriorColor(vehicle.interiorColor);
        setSeats(vehicle.seats);
        setDoors(vehicle.doors);
        setLocation(vehicle.location);
        setFeatured(vehicle.featured);
        setDescription(vehicle.description);
        setServiceHistory(vehicle.serviceHistory || '');
        setIsPriceNegotiable(vehicle.isPriceNegotiable);
        setIsPriceOnRequest(vehicle.isPriceOnRequest);
        setHidePrice(vehicle.hidePrice);
        setWasPrice(vehicle.wasPrice || '');
        setVideoUrl(vehicle.videoUrl || '');
        setCoverImage(vehicle.coverImage);
        setImages(vehicle.images || []);
        setSeoTitle(vehicle.seoTitle || '');
        setSeoDescription(vehicle.seoDescription || '');

        setSafetyFeatures((vehicle.features.safety || []).join(', '));
        setComfortFeatures((vehicle.features.comfort || []).join(', '));
        setTechFeatures((vehicle.features.tech || []).join(', '));
        setExteriorFeatures((vehicle.features.exterior || []).join(', '));

        if (privateData) {
          setVin(privateData.vin || '');
          setCostPrice(privateData.costPrice || vehicle.price * 0.88);
          setMarkupType(privateData.markupType || 'percentage');
          setMarkupValue(privateData.markupValue || 12);
          setRoundingRule(privateData.roundingRule || 500);
          setPriceHistory(privateData.priceHistory || []);
        }
      }
    }
  }, [id, isNew]);

  // Handle AI Assisted Description Drafting
  const handleAiDraftDescription = async () => {
    setIsAiDrafting(true);
    try {
      const keyFeaturesList = [
        ...safetyFeatures.split(','),
        ...comfortFeatures.split(','),
        ...techFeatures.split(',')
      ].map(s => s.trim()).filter(Boolean);

      const drafted = await generateVehicleDescriptionAI(
        make,
        model,
        trim,
        year,
        condition,
        keyFeaturesList
      );
      setDescription(drafted);
      addToast('Drafted description using copywriting guidelines', 'success');
    } catch (err) {
      console.error(err);
      addToast('Error drafting description', 'error');
    } finally {
      setIsAiDrafting(false);
    }
  };

  const handleAddSampleImage = () => {
    const colors = ['#C6A15B', '#38BDF8', '#EA580C', '#0E7A33', '#9AA0A8'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newImg = getCarSvgPlaceholder(randomColor, `${make} ${model} Photo ${images.length + 1}`);
    setImages(prev => [...prev, newImg]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const vehicleId = isNew ? `veh-${Date.now()}` : id!;

    const vehiclePayload: Vehicle = {
      id: vehicleId,
      stockNo,
      slug: slug.trim(),
      title: title.trim(),
      year: Number(year),
      make: make.trim(),
      model: model.trim(),
      trim: trim.trim(),
      condition,
      status,
      categoryIds: selectedCategoryIds,
      bodyType,
      price: effectiveSellingPrice,
      wasPrice: typeof wasPrice === 'number' ? wasPrice : undefined,
      isPriceNegotiable,
      isPriceOnRequest,
      hidePrice,
      mileage: Number(mileage),
      fuel,
      transmission,
      drivetrain,
      engineSize: engineSize.trim(),
      exteriorColor: exteriorColor.trim(),
      interiorColor: interiorColor.trim(),
      seats: Number(seats),
      doors: Number(doors),
      location: location.trim(),
      featured,
      images,
      coverImage,
      videoUrl: videoUrl.trim() || undefined,
      description: description.trim(),
      features: {
        safety: safetyFeatures.split(',').map(s => s.trim()).filter(Boolean),
        comfort: comfortFeatures.split(',').map(s => s.trim()).filter(Boolean),
        tech: techFeatures.split(',').map(s => s.trim()).filter(Boolean),
        exterior: exteriorFeatures.split(',').map(s => s.trim()).filter(Boolean),
      },
      serviceHistory: serviceHistory.trim() || undefined,
      listedDate: new Date().toISOString(),
      viewsCount: 0,
      seoTitle: seoTitle.trim() || undefined,
      seoDescription: seoDescription.trim() || undefined,
      isDemo: true // clearly labeled demo per rules
    };

    const privatePayload: VehiclePrivate = {
      vehicleId,
      vin: vin.trim(),
      costPrice: Number(costPrice),
      markupType,
      markupValue: Number(markupValue),
      computedSellingPrice: effectiveSellingPrice,
      marginAmount: effectiveSellingPrice - costPrice,
      marginPercent: effectiveSellingPrice > 0 ? Number((((effectiveSellingPrice - costPrice) / effectiveSellingPrice) * 100).toFixed(2)) : 0,
      roundingRule,
      manualOverridePrice: typeof manualPriceOverride === 'number' ? manualPriceOverride : undefined,
      priceHistory,
      internalNotes: 'Updated in Admin Vehicle Editor'
    };

    saveAdminVehicle(vehiclePayload, privatePayload, adminUser?.name || 'Admin');
    refreshData();
    addToast(isNew ? 'New vehicle added and published to showroom' : 'Vehicle listing updated successfully', 'success');
    navigate('/admin/vehicles');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#23272C]">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/vehicles"
            className="p-2 rounded bg-[#16181B] border border-[#23272C] text-[#9AA0A8] hover:text-[#F5F2EB]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C6A15B]">
              {isNew ? 'Create New Vehicle Listing' : `Edit Vehicle #${stockNo}`}
            </span>
            <h1 className="font-heading text-3xl font-black uppercase text-[#F5F2EB]">
              {title || 'Vehicle Editor'}
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2.5 bg-[#C6A15B] text-[#0A0A0B] font-heading text-sm font-bold uppercase tracking-wider rounded-[2px] hover:bg-[#A8843F] flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>Save & Publish</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 text-xs sm:text-sm">
        {/* ==================== 1. PRIVATE PRICING & COST PANEL (Owner Only) ==================== */}
        {isOwner && (
          <div className="card-luxury p-6 sm:p-8 border-[#C6A15B]/40 space-y-5 bg-[#16181B]">
            <div className="flex items-center justify-between pb-3 border-b border-[#23272C]">
              <div className="flex items-center gap-2 text-[#C6A15B]">
                <Lock className="w-4 h-4" />
                <h2 className="font-heading text-xl font-bold uppercase">
                  Private Dealership Pricing & Margin Engine
                </h2>
              </div>
              <span className="text-[10px] font-mono uppercase bg-[#C6A15B]/20 text-[#C6A15B] px-2 py-0.5 rounded-[2px] border border-[#C6A15B]/30">
                Admin Exclusive • Never Leaked Publicly
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">
                  Cost Price (US$)*
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={costPrice}
                  onChange={e => setCostPrice(Number(e.target.value))}
                  className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-sm font-bold text-[#F5F2EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">
                  Markup Strategy
                </label>
                <select
                  value={markupType}
                  onChange={e => setMarkupType(e.target.value as any)}
                  className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs text-[#F5F2EB]"
                >
                  <option value="percentage">Percentage Markup (%)</option>
                  <option value="fixed">Fixed Margin (US$)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">
                  Markup Value ({markupType === 'percentage' ? '%' : 'US$'})
                </label>
                <input
                  type="number"
                  value={markupValue}
                  onChange={e => setMarkupValue(Number(e.target.value))}
                  className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-sm text-[#F5F2EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">
                  Rounding Rule
                </label>
                <select
                  value={roundingRule}
                  onChange={e => setRoundingRule(Number(e.target.value) as any)}
                  className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs text-[#F5F2EB]"
                >
                  <option value={50}>Nearest US$50</option>
                  <option value={100}>Nearest US$100</option>
                  <option value={500}>Nearest US$500</option>
                </select>
              </div>
            </div>

            {/* Live Computed Selling Price & Margin Display */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#0A0A0B] border border-[#23272C] rounded-[2px] text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#9AA0A8] block">
                  Computed Public Selling Price
                </span>
                <strong className="font-heading text-3xl font-black text-[#C6A15B] mt-0.5 block">
                  US${effectiveSellingPrice.toLocaleString('en-US')}
                </strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#9AA0A8] block">
                  Gross Profit Margin
                </span>
                <strong className="font-heading text-3xl font-black text-[#0E7A33] mt-0.5 block">
                  US${(effectiveSellingPrice - costPrice).toLocaleString('en-US')}
                </strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#9AA0A8] block">
                  Profit Percentage
                </span>
                <strong className="font-heading text-3xl font-black text-[#0E7A33] mt-0.5 block">
                  +{(((effectiveSellingPrice - costPrice) / effectiveSellingPrice) * 100).toFixed(1)}%
                </strong>
              </div>
            </div>

            {/* Private VIN & Flags */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">
                  Vehicle VIN / Chassis Number (Private)
                </label>
                <input
                  type="text"
                  value={vin}
                  onChange={e => setVin(e.target.value)}
                  placeholder="e.g. JTMBV0AJ504081923"
                  className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs font-mono text-[#F5F2EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">
                  Was Price (Strikethrough in US$)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 145000"
                  value={wasPrice}
                  onChange={e => setWasPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs text-[#F5F2EB]"
                />
              </div>

              <div className="flex items-center gap-4 pt-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPriceNegotiable}
                    onChange={e => setIsPriceNegotiable(e.target.checked)}
                    className="accent-[#C6A15B]"
                  />
                  <span className="text-xs text-[#F5F2EB]">Price Negotiable</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPriceOnRequest}
                    onChange={e => setIsPriceOnRequest(e.target.checked)}
                    className="accent-[#C6A15B]"
                  />
                  <span className="text-xs text-[#F5F2EB]">Price on Request</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. CORE VEHICLE ATTRIBUTES ==================== */}
        <div className="card-luxury p-6 sm:p-8 space-y-4">
          <h2 className="font-heading text-xl font-bold uppercase text-[#F5F2EB] pb-2 border-b border-[#23272C]">
            Core Vehicle Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">Make*</label>
              <input
                type="text"
                required
                value={make}
                onChange={e => setMake(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs text-[#F5F2EB]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">Model*</label>
              <input
                type="text"
                required
                value={model}
                onChange={e => setModel(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs text-[#F5F2EB]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">Trim / Spec*</label>
              <input
                type="text"
                required
                value={trim}
                onChange={e => setTrim(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs text-[#F5F2EB]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">Year*</label>
              <input
                type="number"
                required
                min={2000}
                max={2026}
                value={year}
                onChange={e => setYear(Number(e.target.value))}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs text-[#F5F2EB]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">Stock Number*</label>
              <input
                type="text"
                required
                value={stockNo}
                onChange={e => setStockNo(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs font-mono text-[#F5F2EB]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">Condition</label>
              <select
                value={condition}
                onChange={e => setCondition(e.target.value as any)}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs text-[#F5F2EB]"
              >
                <option value="Certified">Certified Pre-Owned</option>
                <option value="Pre-owned">Pre-Owned</option>
                <option value="New">Brand New</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">Listing Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs text-[#F5F2EB]"
              >
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Sold">Sold (Kept 90d)</option>
                <option value="Coming Soon">Coming Soon</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">Body Type</label>
              <select
                value={bodyType}
                onChange={e => setBodyType(e.target.value as any)}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs text-[#F5F2EB]"
              >
                <option value="SUV">SUV</option>
                <option value="Double Cab">Double Cab</option>
                <option value="Sedan">Sedan</option>
                <option value="Coupe">Coupe / Sports</option>
                <option value="Pick-up">Pick-up</option>
                <option value="Hatchback">Hatchback</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">Mileage (km)*</label>
              <input
                type="number"
                required
                value={mileage}
                onChange={e => setMileage(Number(e.target.value))}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs text-[#F5F2EB]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">Fuel</label>
              <select
                value={fuel}
                onChange={e => setFuel(e.target.value as any)}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs text-[#F5F2EB]"
              >
                <option value="Diesel">Diesel</option>
                <option value="Petrol">Petrol</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">Transmission</label>
              <select
                value={transmission}
                onChange={e => setTransmission(e.target.value as any)}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs text-[#F5F2EB]"
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="Dual-Clutch">Dual-Clutch</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">Drivetrain</label>
              <select
                value={drivetrain}
                onChange={e => setDrivetrain(e.target.value as any)}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs text-[#F5F2EB]"
              >
                <option value="4WD">4WD</option>
                <option value="AWD">AWD</option>
                <option value="RWD">RWD</option>
                <option value="FWD">FWD</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">Engine Output</label>
              <input
                type="text"
                value={engineSize}
                onChange={e => setEngineSize(e.target.value)}
                placeholder="e.g. 3.3L V6 Twin-Turbo"
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs text-[#F5F2EB]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">Exterior Colour</label>
              <input
                type="text"
                value={exteriorColor}
                onChange={e => setExteriorColor(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs text-[#F5F2EB]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">Interior Colour</label>
              <input
                type="text"
                value={interiorColor}
                onChange={e => setInteriorColor(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs text-[#F5F2EB]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">Seating Capacity</label>
              <input
                type="number"
                value={seats}
                onChange={e => setSeats(Number(e.target.value))}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs text-[#F5F2EB]"
              />
            </div>
          </div>
        </div>

        {/* ==================== 3. DESCRIPTION & AI COPYWRITER ==================== */}
        <div className="card-luxury p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#23272C]">
            <h2 className="font-heading text-xl font-bold uppercase text-[#F5F2EB]">
              Listing Copy & Narrative
            </h2>
            <button
              type="button"
              disabled={isAiDrafting}
              onClick={handleAiDraftDescription}
              className="px-3 py-1.5 bg-[#C6A15B] text-[#0A0A0B] font-heading text-xs font-bold uppercase tracking-wider rounded-[2px] hover:bg-[#A8843F] flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAiDrafting ? 'Drafting...' : 'AI Assist: Draft Description'}</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">
              Vehicle Description (Min. 120 words recommended for Harare SEO)
            </label>
            <textarea
              rows={5}
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Detailed description highlighting road clearance, mechanical condition, and Borrowdale showroom availability..."
              className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] p-3 text-xs leading-relaxed text-[#F5F2EB]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">
              Service History / Inspection Notes
            </label>
            <input
              type="text"
              value={serviceHistory}
              onChange={e => setServiceHistory(e.target.value)}
              placeholder="e.g. Stamped dealer book up to 25,000km. No accident history."
              className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs text-[#F5F2EB]"
            />
          </div>
        </div>

        {/* ==================== 4. EQUIPMENT & PACKAGES CHECKLIST ==================== */}
        <div className="card-luxury p-6 sm:p-8 space-y-4">
          <h2 className="font-heading text-xl font-bold uppercase text-[#F5F2EB] pb-2 border-b border-[#23272C]">
            Equipment Checklist (Comma-separated)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#C6A15B] mb-1">Safety Features</label>
              <textarea
                rows={2}
                value={safetyFeatures}
                onChange={e => setSafetyFeatures(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] p-2 text-xs text-[#F5F2EB]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#C6A15B] mb-1">Comfort Features</label>
              <textarea
                rows={2}
                value={comfortFeatures}
                onChange={e => setComfortFeatures(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] p-2 text-xs text-[#F5F2EB]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#C6A15B] mb-1">Technology & Infotainment</label>
              <textarea
                rows={2}
                value={techFeatures}
                onChange={e => setTechFeatures(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] p-2 text-xs text-[#F5F2EB]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#C6A15B] mb-1">Exterior & Wheels</label>
              <textarea
                rows={2}
                value={exteriorFeatures}
                onChange={e => setExteriorFeatures(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] p-2 text-xs text-[#F5F2EB]"
              />
            </div>
          </div>
        </div>

        {/* ==================== 5. IMAGE ASSET MANAGER ==================== */}
        <div className="card-luxury p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#23272C]">
            <h2 className="font-heading text-xl font-bold uppercase text-[#F5F2EB]">
              Gallery Photos ({images.length})
            </h2>
            <button
              type="button"
              onClick={handleAddSampleImage}
              className="text-xs text-[#C6A15B] hover:underline font-semibold"
            >
              + Add Neutral Studio Angle
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-[16/10] rounded overflow-hidden border border-[#23272C] group">
                <img src={img} alt="Vehicle Angle" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                  <button
                    type="button"
                    onClick={() => setCoverImage(img)}
                    className="p-1 bg-[#C6A15B] text-[#0A0A0B] text-[10px] font-bold rounded"
                  >
                    Set Cover
                  </button>
                  <button
                    type="button"
                    onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                    className="p-1 bg-[#B3261E] text-white text-[10px] font-bold rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==================== 6. SEO & GOOGLE PREVIEW ==================== */}
        <div className="card-luxury p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#23272C]">
            <h2 className="font-heading text-xl font-bold uppercase text-[#F5F2EB]">
              SEO Snippet & Canonical URL
            </h2>
            <Globe className="w-4 h-4 text-[#C6A15B]" />
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">
                URL Slug (/vehicle/[slug])
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={e => setSlug(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs font-mono text-[#F5F2EB]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-[#9AA0A8] mb-1">
                <span>Meta Title</span>
                <span className={seoTitle.length > 60 ? 'text-[#EA580C]' : 'text-[#0E7A33]'}>
                  {seoTitle.length}/60 chars
                </span>
              </div>
              <input
                type="text"
                value={seoTitle}
                onChange={e => setSeoTitle(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs text-[#F5F2EB]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-[#9AA0A8] mb-1">
                <span>Meta Description</span>
                <span className={seoDescription.length > 155 ? 'text-[#EA580C]' : 'text-[#0E7A33]'}>
                  {seoDescription.length}/155 chars
                </span>
              </div>
              <textarea
                rows={2}
                value={seoDescription}
                onChange={e => setSeoDescription(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] p-2 text-xs text-[#F5F2EB]"
              />
            </div>

            {/* Live Google Search Preview */}
            <div className="p-4 bg-[#0A0A0B] border border-[#23272C] rounded-[2px]">
              <span className="text-[10px] font-mono text-[#9AA0A8] uppercase block mb-1">
                Google Search Snippet Preview:
              </span>
              <span className="text-xs text-[#38BDF8] hover:underline font-medium block truncate">
                https://borrowdaleautosales.co.zw/vehicle/{slug}
              </span>
              <h4 className="text-sm font-semibold text-[#C6A15B] mt-0.5 line-clamp-1">
                {seoTitle || `${title} for Sale in Harare | Borrowdale Auto Sales`}
              </h4>
              <p className="text-xs text-[#9AA0A8] mt-1 line-clamp-2">
                {seoDescription || description.slice(0, 150)}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#23272C]">
          <Link
            to="/admin/vehicles"
            className="px-6 py-2.5 rounded-[2px] bg-[#16181B] border border-[#23272C] text-xs font-bold uppercase"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-8 py-2.5 bg-[#C6A15B] text-[#0A0A0B] font-heading text-sm font-bold uppercase tracking-wider rounded-[2px] hover:bg-[#A8843F]"
          >
            Save Vehicle Listing
          </button>
        </div>
      </form>
    </div>
  );
};
