"use client"

import { Stack, Typography, Box } from "@mui/material"
import { useTheme, type Theme } from "@mui/material/styles"
import Union from "@/assets/images/Union.png"
import Image from "next/image"
import { useEffect, useState } from "react"
import { motion, useAnimation } from "framer-motion"
import step1 from "@/assets/images/how1.webp"
import step2 from "@/assets/images/how2.webp"
import step3 from "@/assets/images/how3.webp"
import step4 from "@/assets/images/how4.webp"
import step5 from "@/assets/images/how5.webp"

const MobileHowItWorks = () => {
    const theme = useTheme<Theme>()
    const [isInViewMobile, setIsInViewMobile] = useState(false)

    const mobileLineControls = useAnimation()
    const mobileImageControls = useAnimation()

    useEffect(() => {
        const mobileObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) {
                    setIsInViewMobile(true)
                }
            },
            { threshold: 0.5 }
        )
        const el = document.getElementById("mobileHowItWorksSection")
        if (el) mobileObserver.observe(el)

        return () => {
            if (el) mobileObserver.unobserve(el)
        }
    }, [])

    useEffect(() => {
        if (isInViewMobile) {
            void mobileLineControls
                .start({
                    height: "100%",
                    transition: { duration: 1, ease: "easeOut" },
                })
                .catch((error) => {
                    console.error("Error in mobileLineControls animation:", error)
                })

            setTimeout(() => {
                void mobileImageControls
                    .start({
                        scale: 1.1,
                        transition: {
                            duration: 0.3,
                            ease: "easeOut",
                        },
                    })
                    .then(() => {
                        void mobileImageControls.start({
                            scale: 1,
                            transition: { duration: 0.3, ease: "easeOut" },
                        })
                    })
                    .catch((error) => {
                        console.error("Error in mobileImageControls animation:", error)
                    })
            }, 1000)
        }
    }, [isInViewMobile, mobileLineControls, mobileImageControls])

    return (
        <Stack
            id="mobileHowItWorksSection"
            display={{ xs: "block", lg: "none" }}
            height={"50%"}
            width={"100%"}
            sx={{
                borderRadius: 2,
                position: 'relative',
                paddingY: { xs: 2, lg: 0 },
                backgroundColor: { xs: theme.palette.transparentPaper.main, lg: "transparent" },
                border: { xs: `1px solid ${theme.palette.headerBorder.main}`, lg: "none" },
            }}
        >
            <Image
                className="howItWorksUnion"
                src={Union}
                alt="Union"
                fill
                style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
            />
            <Typography
                variant="h5"
                sx={{
                    background: theme.palette.uranoGradient,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 500,
                    fontSize: 22,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    marginTop: "1%",
                    marginLeft: "3.75%",
                    zIndex: 2,
                    display: { xs: "none", lg: "block" },
                }}
            >
                How it works
            </Typography>
            <Typography
                variant="h5"
                sx={{
                    background: theme.palette.uranoGradient,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 500,
                    fontSize: 22,
                    display: { xs: "block", lg: "none" },
                    marginBottom: 1,
                    paddingX: 2,
                }}
            >
                How it works
            </Typography>

            <Stack
                width={"100%"}
                height={"100%"}
                sx={{
                    minHeight: 220,
                    width: "100%",
                    display: "flex",
                    flexDirection: { xs: "column", lg: "row" },
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingX: { xs: 0, lg: 5 },
                    paddingTop: { xs: 2, lg: 6 },
                    paddingBottom: 2,
                    gap: { xs: 2, lg: 4 },
                    position: "relative",
                    zIndex: 2,
                }}
            >
                {/* Mobile Line */}
                <Box
                    id="howItWorksMobileLine"
                    sx={{
                        height: "96%",
                        width: 5,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 5,
                        marginTop: 1,
                        display: { xs: "block", lg: "none" },
                    }}
                >
                    <motion.div
                        animate={mobileLineControls}
                        style={{
                            height: "0%",
                            borderLeft: `3px solid ${theme.palette.uranoGreen1.main}`,
                        }}
                    />
                </Box>

                <Stack paddingX={2} width={{ xs: "100%", lg: "17%" }} gap={1}>
                    <Stack direction={"row"} gap={1} alignItems={"center"}>
                        <Image src={step1} alt="step1" width={64} height={56} style={{ borderRadius: 2 }} />
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 400, fontSize: 16, color: theme.palette.text.secondary }}
                        >
                            <strong style={{ color: theme.palette.text.primary, fontWeight: 400 }}>Sign up</strong> with your email
                        </Typography>
                    </Stack>
                </Stack>


                <Stack paddingX={2} width={{ xs: "100%", lg: "22%" }} gap={1}>
                    <Stack direction={"row"} gap={1} alignItems={"center"}>
                        <Image src={step2} alt="step2" width={64} height={56} style={{ borderRadius: 2 }} />
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 400, fontSize: 16, color: theme.palette.text.secondary }}
                        >
                            Verify your identity via <strong style={{ color: theme.palette.text.primary, fontWeight: 400 }}>Persona</strong>
                        </Typography>
                    </Stack>
                </Stack>

                <Stack paddingX={2} width={{ xs: "100%", lg: "17%" }} gap={1}>
                    <Stack direction={"row"} gap={1} alignItems={"center"}>
                        <Image src={step3} alt="step3" width={64} height={56} style={{ borderRadius: 2 }} />
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 400, fontSize: 16, color: theme.palette.text.secondary }}
                        >
                            <strong style={{ color: theme.palette.text.primary, fontWeight: 400 }}>Connect</strong> your wallet
                        </Typography>
                    </Stack>
                </Stack>

                <Stack paddingX={2} width={{ xs: "100%", lg: "17%" }} gap={1}>
                    <Stack direction={"row"} gap={1} alignItems={"center"}>
                        <Image src={step4} alt="step4" width={64} height={56} style={{ borderRadius: 2 }} />
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 400, fontSize: 16, color: theme.palette.text.secondary }}
                        >
                            <strong style={{ color: theme.palette.text.primary, fontWeight: 400 }}>Select your amount</strong> & buy
                        </Typography>
                    </Stack>
                </Stack>

                <Stack paddingX={2} width={{ xs: "100%", lg: "20%" }} gap={1}>
                    <Stack direction={"row"} gap={1} alignItems={"center"}>
                        <Image src={step5} alt="step5" width={64} height={56} style={{ borderRadius: 2 }} />
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 400, fontSize: 16, color: theme.palette.text.secondary }}
                        >
                            Claim your <strong style={{ color: theme.palette.text.primary, fontWeight: 400 }}>$URANO at TGE</strong>
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}

export default MobileHowItWorks
