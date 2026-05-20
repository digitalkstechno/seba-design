'use client';

import { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { BsGlobe, BsShare } from "react-icons/bs";
import { IoCaretDownOutline } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { AiOutlineHome } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import api from "@/lib/axios";
import FooterSponsors from "@/components/FooterSponsors";
import SearchableSelect from "@/components/SearchableSelect";
import Footer from "@/components/Footer";

const Search = () => {
    const router = useRouter();
    const [isOn, setIsOn] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [area, setArea] = useState("All Area");
    const [categories, setCategories] = useState<any[]>([]);
    const [subCategories, setSubCategories] = useState<any[]>([]);
    const [areas, setAreas] = useState<string[]>([]);
    const [sponsors, setSponsors] = useState<any[]>([]);

    const [dragX, setDragX] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef<{ startX: number; base: number; hasMoved: boolean } | null>(null);

    useEffect(() => {
        if (!isDragging) return;

        const handleMove = (clientX: number) => {
            if (!dragStartRef.current) return;
            const deltaX = clientX - dragStartRef.current.startX;
            if (Math.abs(deltaX) > 5) {
                dragStartRef.current.hasMoved = true;
            }
            let newX = dragStartRef.current.base + deltaX;
            if (newX < 2) newX = 2;
            if (newX > 87) newX = 87;
            setDragX(newX);
        };

        const handleMouseMove = (e: MouseEvent) => {
            handleMove(e.clientX);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                handleMove(e.touches[0].clientX);
            }
        };

        const handleUp = () => {
            setIsDragging(false);
            if (dragStartRef.current) {
                const { hasMoved } = dragStartRef.current;
                const currentDragX = dragX !== null ? dragX : (isOn ? 87 : 2);
                dragStartRef.current = null;
                setDragX(null);

                if (hasMoved) {
                    const threshold = 2 + (87 - 2) / 2; // 44.5px
                    const shouldBeOn = currentDragX > threshold;
                    handleToggleState(shouldBeOn);
                } else {
                    handleToggleClick();
                }
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleUp);
        window.addEventListener("touchmove", handleTouchMove, { passive: true });
        window.addEventListener("touchend", handleUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleUp);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleUp);
        };
    }, [isDragging, isOn, dragX]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                // Fetch dynamic categories
                const catRes = await api.get('/seba/category');
                if (catRes.data.status === 'Success') {
                    setCategories(catRes.data.data);
                }

                // Fetch members for areas (areas are still dynamic based on existing members)
                const memberRes = await api.get('/seba/member');
                if (memberRes.data.status === 'Success') {
                    const ars = Array.from(new Set(memberRes.data.data.map((m: any) => m.area).filter(Boolean))) as string[];
                    setAreas(ars);
                }

                // Fetch sponsors
                const sponsorRes = await api.get('/seba/sponsor');
                if (sponsorRes.data.status === 'Success') {
                    setSponsors(sponsorRes.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch search options", err);
            }
        };
        fetchOptions();
    }, []);

    const toggleDropdown = (type: string) => {
        setOpenDropdown(openDropdown === type ? null : type);
    };

    const triggerSearchRedirect = (targetIsOn: boolean) => {
        if (targetIsOn) {
            const params = new URLSearchParams();
            if (category) {
                params.append('category', category);
                if (subCategory) {
                    params.append('subCategory', subCategory);
                }
            }
            if (area && area !== "All Area") {
                params.append('area', area);
            }

            const queryString = params.toString();
            const query = queryString ? `?${queryString}` : '';

            setTimeout(() => {
                router.push(`/search/results${query}`);
            }, 500);
        }
    };

    const handleToggleState = (targetIsOn: boolean) => {
        setIsOn(targetIsOn);
        setDragX(null);
        triggerSearchRedirect(targetIsOn);
    };

    const handleToggleClick = () => {
        const nextIsOn = !isOn;
        handleToggleState(nextIsOn);
    };

    const handleStartDrag = (clientX: number) => {
        const baseTranslate = isOn ? 87 : 2;
        dragStartRef.current = {
            startX: clientX,
            base: baseTranslate,
            hasMoved: false
        };
        setDragX(baseTranslate);
        setIsDragging(true);
    };

    const onMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        handleStartDrag(e.clientX);
    };

    const onTouchStart = (e: React.TouchEvent) => {
        handleStartDrag(e.touches[0].clientX);
    };

    const coSponsor = sponsors.find(s => s.type === 'co-sponsor');

    const combinedOptions: any[] = [];
    categories.forEach(cat => {
        combinedOptions.push({ name: cat.name });
        if (Array.isArray(cat.subCategories)) {
            cat.subCategories.forEach((sub: string) => {
                combinedOptions.push({ name: sub, isSub: true, parentCategory: cat.name });
            });
        }
    });

    return (
        <div className="h-screen bg-[#d9d9d9] flex justify-center items-start">
            <div className="w-[420px] h-full bg-[#eeeeee] relative px-4 pt-4 shadow-md flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <IoIosArrowBack onClick={() => router.back()} className="text-xl cursor-pointer" />
                        <p className="text-[14px] italic">
                            Welcome to <span className="font-semibold italic">Search Zone</span>
                        </p>
                    </div>
                    {/* Profile */}
                    <div className="absolute right-[-14px] top-[-14px] z-20">
                        <img
                            src="/images/search_profile.png"
                            className="w-[110px] h-[110px] object-contain"
                            alt="profile"
                        />
                    </div>
                </div>

                <div className="flex justify-center mt-12 mb-6">
                    <img
                        src="/images/search_point.png"
                        alt="Search Point"
                        className="w-[250px] h-auto object-contain"
                    />
                </div>

                {/* Dropdowns */}
                <div className="flex flex-col gap-5 px-1">
                    <SearchableSelect
                        options={combinedOptions}
                        value={subCategory || category}
                        onChange={(val, opt) => {
                            if (val === (subCategory || category)) {
                                setCategory("");
                                setSubCategory("");
                            } else if (opt?.isSub) {
                                setCategory(opt.parentCategory || "");
                                setSubCategory(opt.name);
                            } else {
                                setCategory(val);
                                setSubCategory("");
                            }
                        }}
                        placeholder="Category / Sub Category"
                        showOthers={false}
                        triggerStyle={{
                            background: "#f7f7f7",
                            boxShadow: "inset 0 3px 2px rgba(0,0,0,0.1), 0 1px 2px white",
                            border: "1px solid #cfcfcf",
                            borderRadius: "9999px",
                            height: "50px",
                            paddingRight: "5px",
                            paddingLeft: "1.25rem"
                        }}
                        customIcon={
                            <div className="w-10 h-10 bg-[#28b446] rounded-full flex items-center justify-center shadow-md">
                                <IoCaretDownOutline className="text-white text-xl" />
                            </div>
                        }
                    />

                    <SearchableSelect
                        options={[{ name: "All Area" }, ...areas.map(a => ({ name: a }))]}
                        value={area}
                        onChange={(val) => setArea(val)}
                        placeholder="Area"
                        showOthers={false}
                        triggerStyle={{
                            background: "#f7f7f7",
                            boxShadow: "inset 0 3px 2px rgba(0,0,0,0.1), 0 1px 2px white",
                            border: "1px solid #cfcfcf",
                            borderRadius: "9999px",
                            height: "50px",
                            paddingRight: "5px",
                            paddingLeft: "1.25rem"
                        }}
                        customIcon={
                            <div className="w-10 h-10 bg-[#28b446] rounded-full flex items-center justify-center shadow-md">
                                <IoCaretDownOutline className="text-white text-xl" />
                            </div>
                        }
                    />
                </div>

                {/* Radio button */}
                <div className="flex justify-center mt-5">
                    <div
                        onMouseDown={onMouseDown}
                        onTouchStart={onTouchStart}
                        className="relative w-[180px] h-[58px] rounded-full p-[3px] cursor-pointer flex items-center transition-all duration-300 select-none"
                    >
                        <div
                            className="absolute inset-[4px] rounded-full overflow-hidden"
                            style={{
                                backgroundColor: "#bebebe",
                                boxShadow: "inset 0 6px 12px rgba(0,0,0,0.3)",
                                borderTop: "3px solid #999"
                            }}
                        >
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: "linear-gradient(to bottom, #28b446, #1e9a3a)",
                                    boxShadow: "inset 0 4px 8px rgba(0,0,0,0.2)",
                                    opacity: dragX !== null ? (dragX - 2) / 85 : (isOn ? 1 : 0),
                                    transition: dragX !== null ? "none" : "opacity 0.5s ease"
                                }}
                            />
                        </div>
                        <div
                            className="absolute h-[46px] w-[90px] rounded-full flex items-center px-[5px]"
                            style={{
                                transform: dragX !== null ? `translateX(${dragX}px)` : (isOn ? "translateX(87px)" : "translateX(2px)"),
                                transition: dragX !== null ? "none" : "all 0.5s ease",
                                backgroundColor: "#fcfcfc",
                                background: "linear-gradient(to bottom, #ffffff, #e0e0e0)",
                                boxShadow: "0 6px 15px rgba(0,0,0,0.3), inset 0 2px 2px white", // Pop-out effect
                                zIndex: 1,
                                cursor: "grab"
                            }}
                        >
                            <div
                                className="w-[46px] h-[36px] rounded-full"
                                style={{
                                    background: "radial-gradient(circle at 30% 30%, #ffffff, #d4d4d4)",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.2), inset -1px -1px 3px rgba(0,0,0,0.1)",
                                    transform: dragX !== null ? `translateX(${(dragX - 2) * (39 / 85)}px)` : (isOn ? "translateX(39px)" : "translateX(0px)"),
                                    transition: dragX !== null ? "none" : "all 0.5s ease"
                                }}
                            />
                        </div>
                        {/* Text ON / OFF */}
                        <span
                            className="absolute font-bold text-xl select-none text-white"
                            style={{
                                zIndex: 5,
                                left: dragX !== null ? `${25 + (1 - (dragX - 2) / 85) * 90}px` : (isOn ? "25px" : "115px"),
                                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                                transition: dragX !== null ? "none" : "all 0.5s ease"
                            }}
                        >
                            {dragX !== null ? (dragX > 44.5 ? "ON" : "OFF") : (isOn ? "ON" : "OFF")}
                        </span>
                    </div>
                </div>

                <FooterSponsors type="co-sponsor" />

                <Footer />
            </div>
        </div>
    )
}

export default Search;
