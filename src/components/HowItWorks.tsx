"use client"

import { Stack, Typography, Box } from "@mui/material"
import { useTheme, type Theme } from "@mui/material/styles"
import Image from "next/image"
import { motion, useAnimation } from "framer-motion"
import { useEffect, useState } from "react"

import Union from "@/assets/images/Union.webp"
import step1 from "@/assets/images/step1.webp"
import step2 from "@/assets/images/step2.webp"
import step3 from "@/assets/images/step3.webp"
import step4 from "@/assets/images/step4.webp"
import step5 from "@/assets/images/step5.webp"

import { IoChevronForward } from "react-icons/io5";

const HowItWorks = () => {
  const theme = useTheme<Theme>()
  const [isInView, setIsInView] = useState(false)

  const lineControls = useAnimation()
  const imageControls = useAnimation()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.5 }
    )

    const el = document.getElementById("howItWorksSection")
    if (el) observer.observe(el)

    return () => {
      if (el) observer.unobserve(el)
    }
  }, [])

  useEffect(() => {
    if (isInView) {
      void lineControls
        .start({
          width: "calc(100% - 2rem)",
          transition: { duration: 1, ease: "easeOut" },
        })
        .catch((error) => {
          console.error("Error in lineControls animation:", error);
        });

      setTimeout(() => {
        void imageControls
          .start({
            scale: 1.1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          })
          .then(() => {
            void imageControls.start({
              scale: 1,
              transition: { duration: 0.3, ease: "easeOut" },
            });
          })
          .catch((error) => {
            console.error("Error in imageControls animation:", error);
          });
      }, 1000);
    }
  }, [isInView, lineControls, imageControls]);


  return (
    <Stack
      id="howItWorksSection"
      height={"50%"}
      width={"100%"}
      display={{ xs: "none", lg: "block" }}
      sx={{
        borderRadius: 2,
        position: "relative",
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
        style={{ position: "absolute", top: 0, left: 0, zIndex: 1, }}
      />
      <Typography
        variant="h5"
        sx={{
          background: theme.palette.uranoGradient,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
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
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
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
          paddingX: { xs: 0, lg: 3 },
          paddingTop: { xs: 2, lg: 6 },
          paddingBottom: 2,
          gap: {xs: 2, lg:1},
          position: "relative",
          zIndex: 2,
        }}
      >
        <Box
          id="howItWorksMobileLine"
          sx={{
            height: "60%",
            width: 5,
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 5,
            marginTop: 1,
            display: { xs: "block", lg: "none" },
          }}
        >
          <Box
            sx={{
              width: "calc(66% + 8rem)",
              height: "100%",
              borderLeft: `3px solid ${theme.palette.uranoGreen1.main}`,
            }}
          />
        </Box>

        <Stack paddingX={2} width={{ xs: "100%", lg: "17%" }} gap={1}>
          <Stack direction={"row"} gap={1} alignItems={"center"} sx={{
            cursor: "pointer",
            transition: "transform .2s",
            "&:hover":{
              transform: {xs: "none", lg: "scale(1.1)"}
            }
          }}>
            <Image src={step1} alt="step1" width={48} height={48} style={{ borderRadius: 2 }} />
            <Typography
              variant="body2"
              sx={{ fontWeight: 400, fontSize: 15, color: theme.palette.text.secondary }}
            >
              <strong style={{ color: theme.palette.text.primary, fontWeight: 400 }}>Sign up</strong> with your email
            </Typography>
          </Stack>
        </Stack>

        <Stack direction={"row"} gap={1} alignItems={"center"}>
          <IoChevronForward size={22} color={theme.palette.text.primary} />
        </Stack>

        <Stack paddingX={2} width={{ xs: "100%", lg: "22%" }} gap={1}>
          <Stack direction={"row"} gap={1} alignItems={"center"} sx={{
            cursor: "pointer",
            transition: "transform .2s",
            "&:hover":{
              transform: {xs: "none", lg: "scale(1.1)"}
            }
          }}>
            <Image src={step2} alt="step2" width={48} height={48} style={{ borderRadius: 2 }} />
            <Typography
              variant="body2"
              sx={{ fontWeight: 400, fontSize: 15, color: theme.palette.text.secondary }}
            >
              Verify your identity via <strong style={{ color: theme.palette.text.primary, fontWeight: 400 }}>Persona</strong>
            </Typography>
          </Stack>
        </Stack>

        <Stack direction={"row"} gap={1} alignItems={"center"}>
          <IoChevronForward size={22} color={theme.palette.text.primary} />
        </Stack>

        <Stack paddingX={2} width={{ xs: "100%", lg: "20%" }} gap={1}>
          <Stack direction={"row"} gap={1} alignItems={"center"} sx={{
            cursor: "pointer",
            transition: "transform .2s",
            "&:hover":{
              transform: {xs: "none", lg: "scale(1.1)"}
            }
          }}>
            <Image src={step3} alt="step3" width={48} height={48} style={{ borderRadius: 2 }} />
            <Typography
              variant="body2"
              sx={{ fontWeight: 400, fontSize: 15, color: theme.palette.text.secondary }}
            >
              <strong style={{ color: theme.palette.text.primary, fontWeight: 400 }}>Connect</strong> your wallet
            </Typography>
          </Stack>
        </Stack>

        <Stack direction={"row"} gap={1} alignItems={"center"}>
          <IoChevronForward size={22} color={theme.palette.text.primary} />
        </Stack>

        <Stack paddingX={2} width={{ xs: "100%", lg: "20%" }} gap={1}>
          <Stack direction={"row"} gap={1} alignItems={"center"} sx={{
            cursor: "pointer",
            transition: "transform .2s",
            "&:hover":{
              transform: {xs: "none", lg: "scale(1.1)"}
            }
          }}>
            <Image src={step4} alt="step4" width={48} height={48} style={{ borderRadius: 2 }} />
            <Typography
              variant="body2"
              sx={{ fontWeight: 400, fontSize: 15, color: theme.palette.text.secondary }}
            >
              <strong style={{ color: theme.palette.text.primary, fontWeight: 400 }}>Select your amount</strong> & buy
            </Typography>
          </Stack>
        </Stack>

        <Stack direction={"row"} gap={1} alignItems={"center"}>
          <IoChevronForward size={22} color={theme.palette.text.primary} />
        </Stack>

        <Stack paddingX={2} width={{ xs: "100%", lg: "20%" }} gap={1}>
          <Stack direction={"row"} gap={1} alignItems={"center"} sx={{
            cursor: "pointer",
            transition: "transform .2s",
            "&:hover":{
              transform: {xs: "none", lg: "scale(1.1)"}
            }
          }}>
            <Image src={step5} alt="step5" width={48} height={48} style={{ borderRadius: 2 }} />
            <Typography
              variant="body2"
              sx={{ fontWeight: 400, fontSize: 15, color: theme.palette.text.secondary }}
            >
              Claim your <strong style={{ color: theme.palette.text.primary, fontWeight: 400 }}>$URANO at TGE</strong>
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      {/* Line Animation */}
      <motion.div
        id="howItWorksDesktopLine"
        animate={lineControls}
        initial={{ width: 0 }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          zIndex: 5,
          height: "5px",
          padding: "0 0 0 2.5rem",
          width: 0,
        }}
      >
        <Box
          sx={{
            height: "100%",
            borderBottom: `3px solid ${theme.palette.uranoGreen1.main}`,
          }}
        />
      </motion.div>
    </Stack>
  )
}

export default HowItWorks
